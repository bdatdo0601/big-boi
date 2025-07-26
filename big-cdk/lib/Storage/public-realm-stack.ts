import {
  DYNAMODB_EVENT_TYPE,
  DynamoDBTablePrefixes,
  RawEventSource,
  S3BucketPrefixes,
} from "@big-boi-commons/typescript/lib";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { DynamoDBStreamToEventBridgePipes } from "../common/constructs/dynamodb-stream-to-eventbridge-pipes";
import { DynamoDBTable } from "../common/constructs/dynamodb-table";
import { S3BucketConstruct } from "../common/constructs/s3-bucket";
import { StackDeploymentProps } from "../config";
import { EventManagementStack } from "../EventManagement";

export type PublicRealmStackProps = StackDeploymentProps & {
  environment: string;
};
export class PublicRealmStack extends cdk.Stack {
  public readonly publicStorageBucket: S3BucketConstruct;
  public readonly eventsTable: DynamoDBTable;
  public readonly contentTable: DynamoDBTable;
  public readonly flexSearchTable: DynamoDBTable;
  public readonly contentStreamPipe?: DynamoDBStreamToEventBridgePipes;

  constructor(
    scope: Construct,
    id: string,
    readonly props: PublicRealmStackProps,
    readonly dependentStacks: {
      eventManagement: EventManagementStack;
    },
  ) {
    super(scope, id, props);

    // Create private storage bucket using S3BucketConstruct
    this.publicStorageBucket = new S3BucketConstruct(this, "PublicStorage", {
      environment: props.environment,
      bucketName: `${S3BucketPrefixes.PUBLIC_OBJECT}-${props.environment}`,
      lifecycleRules: [
        {
          id: "archive-old-versions",
          noncurrentVersionExpiration: cdk.Duration.days(1),
          enabled: true,
        },
      ],
    });

    // DynamoDB Table for Events
    this.eventsTable = new DynamoDBTable(this, "EventsTable", {
      tableName: `${DynamoDBTablePrefixes.PUBLIC_EVENT}-${props.environment}`,
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

    // DynamoDB Table for Content with streams enabled for EventBridge Pipes
    this.contentTable = new DynamoDBTable(this, "ContentTable", {
      tableName: `${DynamoDBTablePrefixes.PUBLIC_CONTENT}-${props.environment}`,
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
      // Enable streams to capture content changes
      dynamoStream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // DynamoDB Table for FlexSearch
    this.flexSearchTable = new DynamoDBTable(this, "FlexSearchTable", {
      tableName: `${DynamoDBTablePrefixes.PUBLIC_FLEXSEARCH}-${props.environment}`,
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

    this.contentStreamPipe = this.enableContentStreaming();

    // Output important resource information
    new cdk.CfnOutput(this, "PublicStorageBucketName", {
      value: this.publicStorageBucket.bucket.bucketName,
      description: "Name of the private storage S3 bucket",
      exportName: `${S3BucketPrefixes.PUBLIC_OBJECT}-bucket-${props.environment}`,
    });

    new cdk.CfnOutput(this, "PublicEventsTableName", {
      value: this.eventsTable.table.tableName,
      description: "Name of the events DynamoDB table",
      exportName: `${DynamoDBTablePrefixes.PUBLIC_EVENT}-table-${props.environment}`,
    });

    new cdk.CfnOutput(this, "PublicContentTableName", {
      value: this.contentTable.table.tableName,
      description: "Name of the content DynamoDB table",
      exportName: `${DynamoDBTablePrefixes.PUBLIC_CONTENT}-table-${props.environment}`,
    });

    new cdk.CfnOutput(this, "PublicFlexSearchTableName", {
      value: this.flexSearchTable.table.tableName,
      description: "Name of the FlexSearch DynamoDB table",
      exportName: `${DynamoDBTablePrefixes.PUBLIC_FLEXSEARCH}-table-${props.environment}`,
    });

    // Add tags to all resources
    cdk.Tags.of(this).add("Project", "PublicRealm");
  }

  /**
   * Enable content streaming to the BigRawBus using EventBridge Pipes
   *
   * @param bigRawBus - The EventBridge bus to send content events to
   * @returns The created content stream pipe
   */
  public enableContentStreaming(): DynamoDBStreamToEventBridgePipes {
    // Create EventBridge Pipe for content table stream
    const contentStreamPipe = new DynamoDBStreamToEventBridgePipes(
      this,
      "ContentStreamPipe",
      {
        table: this.contentTable.table,
        eventBus: this.dependentStacks.eventManagement.bigRawBus.eventBus,
        pipeName: `public-content-stream-${this.props.environment}`,
        description: "Stream public realm content table changes to BigRawBus",
        environment: this.props.environment,

        // Optimize for content table workloads
        batchSize: 10,
        maximumBatchingWindow: cdk.Duration.seconds(1),
        parallelizationFactor: 2,

        // Filter out DELETE events for now, focus on content creation/updates
        filter: DynamoDBStreamToEventBridgePipes.createEventNameFilter(
          Object.values(DYNAMODB_EVENT_TYPE),
        ),

        // Transform events with metadata about the public realm
        inputTransformation:
          DynamoDBStreamToEventBridgePipes.createStandardTransformation(
            RawEventSource.DDB_STREAM,
            DynamoDBTablePrefixes.PUBLIC_CONTENT,
          ),
      },
    );

    // Output pipe information
    new cdk.CfnOutput(this, "PublicContentPipeArn", {
      value: contentStreamPipe.pipe.pipeArn,
      description: "ARN of the public content stream pipe",
      exportName: `public-content-pipe-arn-${this.props.environment}`,
    });

    // Add tags for the pipe
    cdk.Tags.of(contentStreamPipe).add("Purpose", "Content-Stream-Processing");
    cdk.Tags.of(contentStreamPipe).add("ContentRealm", "Public");
    cdk.Tags.of(contentStreamPipe).add("EventDestination", "BigRawBus");

    return contentStreamPipe;
  }
}
