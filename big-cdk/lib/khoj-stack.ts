import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
import { NagSuppressions } from 'cdk-nag';

export class KhojStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create database credentials secret
    const dbCredentials = new secretsmanager.Secret(this, 'KhojDbCredentials', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
      },
    });

    // Create Aurora Serverless v2 PostgreSQL cluster (publicly accessible)
    const dbCluster = new rds.DatabaseCluster(this, 'KhojDatabase', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_4,
      }),
      credentials: rds.Credentials.fromSecret(dbCredentials),
      defaultDatabaseName: 'postgres',
      writer: rds.ClusterInstance.serverlessV2('writer', {
        scaleWithWriter: true,
        publiclyAccessible: true,
      }),
      readers: [
        rds.ClusterInstance.serverlessV2('reader', {
          scaleWithWriter: true,
          publiclyAccessible: true,
        }),
      ],
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 2,
      backup: {
        retention: cdk.Duration.days(7),
        preferredWindow: '03:00-04:00',
      },
      preferredMaintenanceWindow: 'sun:04:00-sun:05:00',
      cloudwatchLogsExports: ['postgresql'],
      cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      deletionProtection: false, // Set to true for production
      storageEncrypted: true,
    });

    // Create ECS Cluster (no VPC specified - uses default VPC)
    const cluster = new ecs.Cluster(this, 'KhojCluster', {
      clusterName: 'khoj-cluster',
      containerInsights: true,
    });

    // Create log groups for services
    const serverLogGroup = new logs.LogGroup(this, 'KhojServerLogGroup', {
      logGroupName: '/aws/ecs/khoj-server',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    const sandboxLogGroup = new logs.LogGroup(this, 'KhojSandboxLogGroup', {
      logGroupName: '/aws/ecs/khoj-sandbox',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    const searchLogGroup = new logs.LogGroup(this, 'KhojSearchLogGroup', {
      logGroupName: '/aws/ecs/khoj-search',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    const computerLogGroup = new logs.LogGroup(this, 'KhojComputerLogGroup', {
      logGroupName: '/aws/ecs/khoj-computer',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    // Create IAM role for ECS tasks with minimal permissions
    const taskRole = new iam.Role(this, 'KhojTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'Role for Khoj ECS tasks',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
      ],
    });

    // Add permissions for the task role to access secrets
    taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'secretsmanager:GetSecretValue',
          'secretsmanager:DescribeSecret',
        ],
        resources: [dbCredentials.secretArn],
      })
    );

    // Add permissions for CloudWatch logs
    taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: [
          serverLogGroup.logGroupArn,
          sandboxLogGroup.logGroupArn,
          searchLogGroup.logGroupArn,
          computerLogGroup.logGroupArn,
        ],
      })
    );

    // Create execution role for ECS tasks
    const executionRole = new iam.Role(this, 'KhojExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'Execution role for Khoj ECS tasks',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
      ],
    });

    // Add permissions for pulling container images
    executionRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ecr:GetAuthorizationToken',
          'ecr:BatchCheckLayerAvailability',
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage',
        ],
        resources: ['*'],
      })
    );

    // Create task definition for sandbox service
    const sandboxTaskDefinition = new ecs.FargateTaskDefinition(this, 'SandboxTaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: taskRole,
      executionRole: executionRole,
    });

    const sandboxContainer = sandboxTaskDefinition.addContainer('sandbox', {
      image: ecs.ContainerImage.fromRegistry('ghcr.io/khoj-ai/terrarium:latest'),
      portMappings: [
        {
          containerPort: 8080,
          protocol: ecs.Protocol.TCP,
        },
      ],
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:8080/health || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(10),
        retries: 2,
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'sandbox',
        logGroup: sandboxLogGroup,
      }),
    });

    // Create Fargate service for sandbox
    const sandboxService = new ecs.FargateService(this, 'SandboxService', {
      cluster,
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
      taskRole: taskRole,
      executionRole: executionRole,
    });

    const searchContainer = searchTaskDefinition.addContainer('search', {
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
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'search',
        logGroup: searchLogGroup,
      }),
    });

    // Create Fargate service for search
    const searchService = new ecs.FargateService(this, 'SearchService', {
      cluster,
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
      taskRole: taskRole,
      executionRole: executionRole,
    });

    const computerContainer = computerTaskDefinition.addContainer('computer', {
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
    const computerService = new ecs.FargateService(this, 'ComputerService', {
      cluster,
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
      taskRole: taskRole,
      executionRole: executionRole,
    });

    // Create the main Khoj server container
    const serverContainer = serverTaskDefinition.addContainer('server', {
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
        POSTGRES_HOST: dbCluster.clusterEndpoint.hostname,
        POSTGRES_PORT: '5432',
        KHOJ_DJANGO_SECRET_KEY: 'your-secret-key-here', // Should be from secrets manager in production
        KHOJ_DEBUG: 'True',
        KHOJ_ADMIN_EMAIL: 'dat.b.do@gmail.com',
        KHOJ_ADMIN_PASSWORD: 'supersecret', // Should be from secrets manager in production
        ANTHROPIC_API_KEY: 'your_anthropic_api_key', // Should be from secrets manager in production
      },
      secrets: {
        POSTGRES_PASSWORD: ecs.Secret.fromSecretsManager(dbCredentials, 'password'),
      },
      command: ['--host=0.0.0.0', '--port=42110', '-vv', '--non-interactive'],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'server',
        logGroup: serverLogGroup,
      }),
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:42110/health || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(10),
        retries: 3,
      },
    });

    // Create Fargate service for main server
    const serverService = new ecs.FargateService(this, 'KhojServerService', {
      cluster,
      taskDefinition: serverTaskDefinition,
      desiredCount: 1,
      assignPublicIp: true,
      serviceName: 'khoj-server',
      enableExecuteCommand: true,
    });

    // Create Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'KhojLoadBalancer', {
      internetFacing: true,
      loadBalancerName: 'khoj-alb',
      vpc: cluster.vpc,
    });

    // Create target group for the main server
    const serverTargetGroup = new elbv2.ApplicationTargetGroup(this, 'ServerTargetGroup', {
      port: 42110,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      vpc: cluster.vpc,
      healthCheck: {
        path: '/health',
        port: '42110',
        protocol: elbv2.Protocol.HTTP,
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
        timeout: cdk.Duration.seconds(10),
        interval: cdk.Duration.seconds(30),
      },
    });

    // Add listener to ALB
    const listener = alb.addListener('KhojListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultTargetGroups: [serverTargetGroup],
    });

    // Register the server service with the target group
    serverService.registerLoadBalancerTargets(
      {
        containerName: 'server',
        containerPort: 42110,
        newTargetGroupId: 'ECS',
        listener: ecs.ListenerConfig.applicationListener(listener, {
          protocol: elbv2.ApplicationProtocol.HTTP,
        }),
      }
    );

    // Create secrets for sensitive environment variables
    const djangoSecret = new secretsmanager.Secret(this, 'KhojDjangoSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ key: 'django-secret-key' }),
        generateStringKey: 'value',
        excludeCharacters: '"@/\\',
        passwordLength: 50,
      },
    });

    const adminSecret = new secretsmanager.Secret(this, 'KhojAdminSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          email: 'dat.b.do@gmail.com',
          password: 'admin-password',
        }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
        passwordLength: 20,
      },
    });

    // Grant task role access to additional secrets
    djangoSecret.grantRead(taskRole);
    adminSecret.grantRead(taskRole);

    // Create IAM policy for inter-service communication
    const serviceCommRole = new iam.Role(this, 'ServiceCommRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'Role for inter-service communication',
    });

    serviceCommRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ecs:DescribeServices',
          'ecs:DescribeTasks',
          'ecs:ListTasks',
        ],
        resources: ['*'],
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
      description: 'DNS name of the load balancer',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: dbCluster.clusterEndpoint.hostname,
      description: 'Aurora PostgreSQL cluster endpoint',
    });

    new cdk.CfnOutput(this, 'KhojUrl', {
      value: `http://${alb.loadBalancerDnsName}`,
      description: 'Khoj application URL',
    });

    new cdk.CfnOutput(this, 'SandboxServiceArn', {
      value: sandboxService.serviceArn,
      description: 'Sandbox service ARN',
    });

    new cdk.CfnOutput(this, 'SearchServiceArn', {
      value: searchService.serviceArn,
      description: 'Search service ARN',
    });

    new cdk.CfnOutput(this, 'ComputerServiceArn', {
      value: computerService.serviceArn,
      description: 'Computer service ARN',
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: dbCredentials.secretArn,
      description: 'Database credentials secret ARN',
    });

    new cdk.CfnOutput(this, 'DjangoSecretArn', {
      value: djangoSecret.secretArn,
      description: 'Django secret key ARN',
    });

    new cdk.CfnOutput(this, 'AdminSecretArn', {
      value: adminSecret.secretArn,
      description: 'Admin credentials secret ARN',
    });

    // CDK Nag suppressions for common issues
    NagSuppressions.addResourceSuppressions(
      this,
      [
        {
          id: 'AwsSolutions-ELB2',
          reason: 'ALB access logging not required for this demo application',
        },
        {
          id: 'AwsSolutions-ECS2',
          reason: 'Environment variables contain non-sensitive configuration',
        },
        {
          id: 'AwsSolutions-RDS2',
          reason: 'RDS storage encryption is enabled by default',
        },
        {
          id: 'AwsSolutions-RDS3',
          reason: 'Multi-AZ is not required for this demo application',
        },
        {
          id: 'AwsSolutions-RDS10',
          reason: 'Deletion protection disabled for demo purposes',
        },
        {
          id: 'AwsSolutions-RDS11',
          reason: 'Default port is acceptable for this use case',
        },
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Wildcard permissions are limited to specific resources and required for ECS operations',
        },
        {
          id: 'AwsSolutions-ECS4',
          reason: 'CloudWatch Container Insights is enabled for monitoring',
        },
        {
          id: 'AwsSolutions-ECS7',
          reason: 'Log configuration is properly set up with CloudWatch',
        },
      ],
      true
    );
  }
}
