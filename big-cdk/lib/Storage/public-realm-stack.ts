import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { DynamoDBTable } from "../common/constructs/dynamodb-table";
import { S3BucketConstruct } from "../common/constructs/s3-bucket";
import { StackDeploymentProps } from "../config";

export type PublicRealmStackProps = StackDeploymentProps & {
  environment: string;
};

export class PublicRealmStack extends cdk.Stack {
  public readonly publicStorageBucket: s3.Bucket;
  public readonly eventsTable: dynamodb.Table;
  public readonly contentTable: dynamodb.Table;
  public readonly flexSearchTable: dynamodb.Table;
  public readonly embeddingLambda: lambda.Function;

  constructor(scope: Construct, id: string, props: PublicRealmStackProps) {
    super(scope, id, props);

    // Create private storage bucket using S3BucketConstruct
    const publicStorage = new S3BucketConstruct(this, "PublicStorage", {
      environment: props.environment,
      bucketName: `public-realm-storage-${props.environment}`,
      lifecycleRules: [
        {
          id: "archive-old-versions",
          noncurrentVersionExpiration: cdk.Duration.days(1),
          enabled: true,
        },
      ],
    });
    this.publicStorageBucket = publicStorage.bucket;

    // DynamoDB Table for Events
    const eventsTableConstruct = new DynamoDBTable(this, "EventsTable", {
      tableName: `public-realm-events-${props.environment}`,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
      globalSecondaryIndexes: [],
      environment: props.environment,
    });
    this.eventsTable = eventsTableConstruct.table;

    // DynamoDB Table for Content
    const contentTableConstruct = new DynamoDBTable(this, "ContentTable", {
      tableName: `public-realm-content-${props.environment}`,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      globalSecondaryIndexes: [],
      environment: props.environment,
    });
    this.contentTable = contentTableConstruct.table;

    // DynamoDB Table for FlexSearch
    const flexSearchTableConstruct = new DynamoDBTable(
      this,
      "FlexSearchTable",
      {
        tableName: `public-realm-flexsearch-${props.environment}`,
        partitionKey: {
          name: "pk",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: {
          name: "sk",
          type: dynamodb.AttributeType.STRING,
        },
        pointInTimeRecovery: true,
        globalSecondaryIndexes: [],
        environment: props.environment,
      },
    );
    this.flexSearchTable = flexSearchTableConstruct.table;

    // Output important resource information
    new cdk.CfnOutput(this, "PublicStorageBucketName", {
      value: this.publicStorageBucket.bucketName,
      description: "Name of the private storage S3 bucket",
      exportName: `public-realm-storage-bucket-${props.environment}`,
    });

    new cdk.CfnOutput(this, "PublicEventsTableName", {
      value: this.eventsTable.tableName,
      description: "Name of the events DynamoDB table",
      exportName: `public-realm-events-table-${props.environment}`,
    });

    new cdk.CfnOutput(this, "PublicContentTableName", {
      value: this.contentTable.tableName,
      description: "Name of the content DynamoDB table",
      exportName: `public-realm-content-table-${props.environment}`,
    });

    new cdk.CfnOutput(this, "PublicFlexSearchTableName", {
      value: this.flexSearchTable.tableName,
      description: "Name of the FlexSearch DynamoDB table",
      exportName: `public-realm-flexsearch-table-${props.environment}`,
    });

    // Add tags to all resources
    cdk.Tags.of(this).add("Project", "PublicRealm");
  }
}
