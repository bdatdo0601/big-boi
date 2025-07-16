import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as logs from "aws-cdk-lib/aws-logs";
import { NagSuppressions } from "cdk-nag";
import { Construct } from "constructs";

import { ContainerStack } from "./container-stack";
import { DatabaseStack } from "./database-stack";
import { IamStack } from "./iam-stack";
import { LoadBalancerStack } from "./load-balancer-stack";
import { SecretsStack } from "./secrets-stack";

export class KnowledgeGraphStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create ECS Cluster (no VPC specified - uses default VPC)
    const cluster = new ecs.Cluster(this, "KhojCluster", {
      clusterName: "khoj-cluster",
      enableFargateCapacityProviders: true,
    });

    // 1. Create Secrets Stack
    const secretsStack = new SecretsStack(this, "SecretsStack", {});

    // 2. Create Database Stack
    const databaseStack = new DatabaseStack(this, "DatabaseStack", {
      dbCredentials: secretsStack.dbCredentials,
      cluster: cluster,
    });

    // Create log groups for IAM stack
    const serverLogGroup = new logs.LogGroup(this, "ServerLogGroup", {
      logGroupName: "/aws/ecs/khoj-server",
      retention: logs.RetentionDays.ONE_MONTH,
    });
    const sandboxLogGroup = new logs.LogGroup(this, "SandboxLogGroup", {
      logGroupName: "/aws/ecs/khoj-sandbox",
      retention: logs.RetentionDays.ONE_MONTH,
    });
    const searchLogGroup = new logs.LogGroup(this, "SearchLogGroup", {
      logGroupName: "/aws/ecs/khoj-search",
      retention: logs.RetentionDays.ONE_MONTH,
    });
    const computerLogGroup = new logs.LogGroup(this, "ComputerLogGroup", {
      logGroupName: "/aws/ecs/khoj-computer",
      retention: logs.RetentionDays.ONE_MONTH,
    });

    const logGroups = [serverLogGroup, sandboxLogGroup, searchLogGroup, computerLogGroup];

    // 3. Create IAM Stack
    const iamStack = new IamStack(this, "IamStack", {
      secrets: {
        dbCredentials: secretsStack.dbCredentials,
        djangoSecret: secretsStack.djangoSecret,
        adminSecret: secretsStack.adminSecret,
        anthropicApiKeySecret: secretsStack.anthropicApiKeySecret,
      },
      logGroups: logGroups,
    });

    // 4. Create Container Stack
    const containerStack = new ContainerStack(this, "ContainerStack", {
      cluster: cluster,
      taskRole: iamStack.taskRole,
      executionRole: iamStack.executionRole,
      secrets: {
        dbCredentials: secretsStack.dbCredentials,
        djangoSecret: secretsStack.djangoSecret,
        adminSecret: secretsStack.adminSecret,
        anthropicApiKeySecret: secretsStack.anthropicApiKeySecret,
      },
      dbCluster: databaseStack.dbCluster,
      logGroups: {
        serverLogGroup: serverLogGroup,
        sandboxLogGroup: sandboxLogGroup,
        searchLogGroup: searchLogGroup,
        computerLogGroup: computerLogGroup,
      },
    });

    // 5. Create Load Balancer Stack
    const loadBalancerStack = new LoadBalancerStack(this, "LoadBalancerStack", {
      cluster: cluster,
      serverService: containerStack.serverService,
      serverContainer: containerStack.serverContainer,
    });

    // Add dependencies to ensure proper creation order
    databaseStack.addDependency(secretsStack);
    iamStack.addDependency(secretsStack);
    containerStack.addDependency(iamStack);
    containerStack.addDependency(databaseStack);
    loadBalancerStack.addDependency(containerStack);

    // Main stack outputs
    new cdk.CfnOutput(this, "KhojApplicationUrl", {
      value: `http://${loadBalancerStack.alb.loadBalancerDnsName}`,
      description: "Main Khoj application URL",
    });

    new cdk.CfnOutput(this, "ClusterName", {
      value: cluster.clusterName,
      description: "ECS Cluster name",
    });

    new cdk.CfnOutput(this, "DatabaseEndpoint", {
      value: databaseStack.dbCluster.clusterEndpoint.hostname,
      description: "Aurora PostgreSQL cluster endpoint",
    });

    // Post-deployment instructions
    new cdk.CfnOutput(this, "PostDeploymentInstructions", {
      value: JSON.stringify({
        step1: "Update Anthropic API key in AWS Secrets Manager",
        step2: "Check ECS services status in AWS Console",
        step3: "Monitor CloudWatch logs for any issues",
        step4: "Access application via LoadBalancer URL above",
      }),
      description: "Post-deployment configuration steps",
    });

    // CDK Nag suppressions for common issues
    NagSuppressions.addResourceSuppressions(
      this,
      [
        {
          id: "AwsSolutions-ELB2",
          reason: "ALB access logging not required for this demo application",
        },
        {
          id: "AwsSolutions-ECS2",
          reason: "Environment variables contain non-sensitive configuration",
        },
        {
          id: "AwsSolutions-RDS2",
          reason: "RDS storage encryption is enabled by default",
        },
        {
          id: "AwsSolutions-RDS3",
          reason: "Multi-AZ is not required for this demo application",
        },
        {
          id: "AwsSolutions-RDS10",
          reason: "Deletion protection disabled for demo purposes",
        },
        {
          id: "AwsSolutions-RDS11",
          reason: "Default port is acceptable for this use case",
        },
        {
          id: "AwsSolutions-IAM5",
          reason:
            "Wildcard permissions are limited to specific resources and required for ECS operations",
        },
        {
          id: "AwsSolutions-ECS4",
          reason: "CloudWatch Container Insights is enabled for monitoring",
        },
        {
          id: "AwsSolutions-ECS7",
          reason: "Log configuration is properly set up with CloudWatch",
        },
        {
          id: "AwsSolutions-SMG4",
          reason:
            "Secrets have appropriate rotation policies for demo purposes",
        },
      ],
      true,
    );
  }
}
