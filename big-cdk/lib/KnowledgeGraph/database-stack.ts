import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

export interface DatabaseStackProps extends cdk.NestedStackProps {
  dbCredentials: secretsmanager.Secret;
  cluster: ecs.Cluster;
}

export class DatabaseStack extends cdk.NestedStack {
  public readonly dbCluster: rds.DatabaseCluster;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    // Create Aurora Serverless v2 PostgreSQL cluster (using cluster VPC)
    this.dbCluster = new rds.DatabaseCluster(this, 'KhojDatabase', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_4,
      }),
      credentials: rds.Credentials.fromSecret(props.dbCredentials),
      defaultDatabaseName: 'postgres',
      writer: rds.ClusterInstance.serverlessV2('writer'),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 4,
      vpc: props.cluster.vpc,
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

    // Outputs
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.dbCluster.clusterEndpoint.hostname,
      description: 'Aurora PostgreSQL cluster endpoint',
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: this.dbCluster.clusterEndpoint.port.toString(),
      description: 'Aurora PostgreSQL cluster port',
    });

    new cdk.CfnOutput(this, 'DatabaseClusterArn', {
      value: this.dbCluster.clusterArn,
      description: 'Aurora PostgreSQL cluster ARN',
    });
  }
}
