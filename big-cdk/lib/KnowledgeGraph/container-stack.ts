import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export interface ContainerStackProps {
  cluster: ecs.Cluster;
  taskRole: iam.Role;
  executionRole: iam.Role;
  secrets: {
    dbCredentials: secretsmanager.Secret;
    djangoSecret: secretsmanager.Secret;
    adminSecret: secretsmanager.Secret;
    anthropicApiKeySecret: secretsmanager.Secret;
  };
  dbCluster: rds.DatabaseCluster;
  logGroups: {
    serverLogGroup: logs.LogGroup;
    sandboxLogGroup: logs.LogGroup;
    searchLogGroup: logs.LogGroup;
    computerLogGroup: logs.LogGroup;
  };
}

export class ContainerStack extends Construct {
  public readonly serverService: ecs.FargateService;
  public readonly sandboxService: ecs.FargateService;
  public readonly searchService: ecs.FargateService;
  public readonly computerService: ecs.FargateService;
  public readonly serverContainer: ecs.ContainerDefinition;

  constructor(scope: Construct, id: string, props: ContainerStackProps) {
    super(scope, id);

    // Use log groups passed from parent stack
    const serverLogGroup = props.logGroups.serverLogGroup;
    const sandboxLogGroup = props.logGroups.sandboxLogGroup;
    const searchLogGroup = props.logGroups.searchLogGroup;
    const computerLogGroup = props.logGroups.computerLogGroup;

    // Create task definition for sandbox service
    const sandboxTaskDefinition = new ecs.FargateTaskDefinition(this, 'SandboxTaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: props.taskRole,
      executionRole: props.executionRole,
    });

    sandboxTaskDefinition.addContainer('sandbox', {
      image: ecs.ContainerImage.fromRegistry('ghcr.io/khoj-ai/terrarium:latest'),
      portMappings: [
        {
          containerPort: 8080,
          protocol: ecs.Protocol.TCP,
        },
      ],
      // Remove health check for now to avoid deployment issues
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'sandbox',
        logGroup: sandboxLogGroup,
      }),
    });

    // Create Fargate service for sandbox
    this.sandboxService = new ecs.FargateService(this, 'SandboxService', {
      cluster: props.cluster,
      taskDefinition: sandboxTaskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
      serviceName: 'khoj-sandbox',
      enableExecuteCommand: true,
    });

    // Create task definition for search service
    const searchTaskDefinition = new ecs.FargateTaskDefinition(this, 'SearchTaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: props.taskRole,
      executionRole: props.executionRole,
    });

    searchTaskDefinition.addContainer('search', {
      image: ecs.ContainerImage.fromRegistry('docker.io/searxng/searxng:latest'),
      portMappings: [
        {
          containerPort: 8080,
          protocol: ecs.Protocol.TCP,
        },
      ],
      environment: {
        SEARXNG_BASE_URL: 'http://localhost:8080/',
      },
      // Remove health check for now to avoid deployment issues
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'search',
        logGroup: searchLogGroup,
      }),
    });

    // Create Fargate service for search
    this.searchService = new ecs.FargateService(this, 'SearchService', {
      cluster: props.cluster,
      taskDefinition: searchTaskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
      serviceName: 'khoj-search',
      enableExecuteCommand: true,
    });

    // Create task definition for computer service
    const computerTaskDefinition = new ecs.FargateTaskDefinition(this, 'ComputerTaskDef', {
      memoryLimitMiB: 1024,
      cpu: 512,
      taskRole: props.taskRole,
      executionRole: props.executionRole,
    });

    computerTaskDefinition.addContainer('computer', {
      image: ecs.ContainerImage.fromRegistry('ghcr.io/khoj-ai/khoj-computer:latest'),
      portMappings: [
        {
          containerPort: 5900,
          protocol: ecs.Protocol.TCP,
        },
      ],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'computer',
        logGroup: computerLogGroup,
      }),
    });

    // Create Fargate service for computer
    this.computerService = new ecs.FargateService(this, 'ComputerService', {
      cluster: props.cluster,
      taskDefinition: computerTaskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
      serviceName: 'khoj-computer',
      enableExecuteCommand: true,
    });

    // Create task definition for main Khoj server
    const serverTaskDefinition = new ecs.FargateTaskDefinition(this, 'ServerTaskDef', {
      memoryLimitMiB: 2048,
      cpu: 1024,
      taskRole: props.taskRole,
      executionRole: props.executionRole,
    });

    // Create the main Khoj server container
    this.serverContainer = serverTaskDefinition.addContainer('server', {
      image: ecs.ContainerImage.fromRegistry('ghcr.io/khoj-ai/khoj:latest'),
      portMappings: [
        {
          containerPort: 42110,
          protocol: ecs.Protocol.TCP,
        },
      ],
      environment: {
        POSTGRES_DB: 'postgres',
        POSTGRES_USER: 'postgres',
        POSTGRES_HOST: props.dbCluster.clusterEndpoint.hostname,
        POSTGRES_PORT: '5432',
        KHOJ_DEBUG: 'True',
        KHOJ_ADMIN_EMAIL: 'dat.b.do@gmail.com',
      },
      secrets: {
        POSTGRES_PASSWORD: ecs.Secret.fromSecretsManager(props.secrets.dbCredentials, 'password'),
        KHOJ_DJANGO_SECRET_KEY: ecs.Secret.fromSecretsManager(props.secrets.djangoSecret, 'value'),
        KHOJ_ADMIN_PASSWORD: ecs.Secret.fromSecretsManager(props.secrets.adminSecret, 'password'),
        ANTHROPIC_API_KEY: ecs.Secret.fromSecretsManager(props.secrets.anthropicApiKeySecret),
      },
      command: ['--host=0.0.0.0', '--port=42110', '-vv', '--non-interactive'],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'server',
        logGroup: serverLogGroup,
      }),
      // Remove health check for now to avoid deployment issues
    });

    // Create Fargate service for main server
    this.serverService = new ecs.FargateService(this, 'KhojServerService', {
      cluster: props.cluster,
      taskDefinition: serverTaskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
      serviceName: 'khoj-server',
      enableExecuteCommand: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ServerServiceArn', {
      value: this.serverService.serviceArn,
      description: 'Khoj server service ARN',
    });

    new cdk.CfnOutput(this, 'SandboxServiceArn', {
      value: this.sandboxService.serviceArn,
      description: 'Sandbox service ARN',
    });

    new cdk.CfnOutput(this, 'SearchServiceArn', {
      value: this.searchService.serviceArn,
      description: 'Search service ARN',
    });

    new cdk.CfnOutput(this, 'ComputerServiceArn', {
      value: this.computerService.serviceArn,
      description: 'Computer service ARN',
    });
  }
}
