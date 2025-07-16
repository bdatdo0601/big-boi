import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface IamStackProps extends cdk.NestedStackProps {
  secrets: {
    dbCredentials: secretsmanager.Secret;
    djangoSecret: secretsmanager.Secret;
    adminSecret: secretsmanager.Secret;
    anthropicApiKeySecret: secretsmanager.Secret;
  };
  logGroups: logs.LogGroup[];
}

export class IamStack extends cdk.NestedStack {
  public readonly taskRole: iam.Role;
  public readonly executionRole: iam.Role;
  public readonly serviceCommRole: iam.Role;

  constructor(scope: Construct, id: string, props: IamStackProps) {
    super(scope, id, props);

    // Create execution role for ECS tasks
    this.executionRole = new iam.Role(this, 'KhojExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'Execution role for Khoj ECS tasks',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
      ],
    });

    // Add permissions for pulling container images
    this.executionRole.addToPolicy(
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

    // Create IAM role for ECS tasks with minimal permissions
    this.taskRole = new iam.Role(this, 'KhojTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'Role for Khoj ECS tasks',
    });

    // Add permissions for the task role to access secrets
    this.taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'secretsmanager:GetSecretValue',
          'secretsmanager:DescribeSecret',
        ],
        resources: [
          props.secrets.dbCredentials.secretArn,
          props.secrets.djangoSecret.secretArn,
          props.secrets.adminSecret.secretArn,
          props.secrets.anthropicApiKeySecret.secretArn,
        ],
      })
    );

    // Add permissions for CloudWatch logs
    this.taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: props.logGroups.map(logGroup => logGroup.logGroupArn),
      })
    );

    // Add permissions for ECS Execute Command
    this.taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ssmmessages:CreateControlChannel',
          'ssmmessages:CreateDataChannel',
          'ssmmessages:OpenControlChannel',
          'ssmmessages:OpenDataChannel',
        ],
        resources: ['*'],
      })
    );

    // Create IAM role for inter-service communication
    this.serviceCommRole = new iam.Role(this, 'ServiceCommRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'Role for inter-service communication',
    });

    this.serviceCommRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ecs:DescribeServices',
          'ecs:DescribeTasks',
          'ecs:ListTasks',
          'servicediscovery:DiscoverInstances',
          'servicediscovery:GetService',
          'servicediscovery:ListServices',
        ],
        resources: ['*'],
      })
    );

    // Grant additional secrets access to the task role
    Object.values(props.secrets).forEach(secret => {
      secret.grantRead(this.taskRole);
    });

    // Outputs
    new cdk.CfnOutput(this, 'TaskRoleArn', {
      value: this.taskRole.roleArn,
      description: 'ECS Task Role ARN',
    });

    new cdk.CfnOutput(this, 'ExecutionRoleArn', {
      value: this.executionRole.roleArn,
      description: 'ECS Execution Role ARN',
    });

    new cdk.CfnOutput(this, 'ServiceCommRoleArn', {
      value: this.serviceCommRole.roleArn,
      description: 'Service Communication Role ARN',
    });
  }
}
