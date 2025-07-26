import {
  DYNAMODB_EVENT_TYPE,
  DynamoDBTablePrefixes,
  RawEventSource,
  S3BucketPrefixes,
} from "@big-boi-commons/typescript/lib";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as path from "path";
import { DynamoDBStreamToEventBridgePipes } from "../common/constructs/dynamodb-stream-to-eventbridge-pipes";
import { DynamoDBTable } from "../common/constructs/dynamodb-table";
import { S3BucketConstruct } from "../common/constructs/s3-bucket";
import { TypeScriptLambda } from "../common/constructs/ts-lambda";
import { StackDeploymentProps } from "../config";
import { EventManagementStack } from "../EventManagement";
import { SecretsStack } from "../Secret";

export type PrivateRealmStackProps = StackDeploymentProps & {
  environment: string;
};

export class PrivateRealmStack extends cdk.Stack {
  public readonly privateStorageBucket: S3BucketConstruct;
  public readonly eventsTable: DynamoDBTable;
  public readonly flexSearchTable: DynamoDBTable;
  public readonly embeddingLambda: TypeScriptLambda;
  public readonly contentTable: DynamoDBTable;
  public readonly contentStreamPipe?: DynamoDBStreamToEventBridgePipes;

  constructor(
    scope: Construct,
    id: string,
    readonly props: PrivateRealmStackProps,
    readonly dependentStacks: {
      secret: SecretsStack;
      eventManagement: EventManagementStack;
    },
  ) {
    super(scope, id, props);

    this.props.environment = props.environment;

    // Create private storage bucket using S3BucketConstruct
    this.privateStorageBucket = new S3BucketConstruct(this, "PrivateStorage", {
      environment: props.environment,
      bucketName: `${S3BucketPrefixes.PRIVATE_OBJECT}-${props.environment}`,
      lifecycleRules: [
        {
          id: "archive-old-versions",
          noncurrentVersionExpiration: cdk.Duration.days(14),
          enabled: true,
        },
      ],
    });

    // DynamoDB Table for Events
    const eventsTable = new DynamoDBTable(this, "EventsTable", {
      tableName: `${DynamoDBTablePrefixes.PRIVATE_EVENT}-${props.environment}`,
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
    this.eventsTable = eventsTable;

    // DynamoDB Table for Content with streams enabled for EventBridge Pipes
    const contentTable = new DynamoDBTable(this, "ContentTable", {
      tableName: `${DynamoDBTablePrefixes.PRIVATE_CONTENT}-${props.environment}`,
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
    this.contentTable = contentTable;

    // DynamoDB Table for FlexSearch
    const flexSearchTable = new DynamoDBTable(this, "FlexSearchTable", {
      tableName: `${DynamoDBTablePrefixes.PRIVATE_FLEXSEARCH}-${props.environment}`,
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
    this.flexSearchTable = flexSearchTable;

    // Create embedding lambda using TypeScriptLambda construct
    this.embeddingLambda = new TypeScriptLambda(this, "EmbeddingLambda", {
      functionName: `private-realm-embedding-${props.environment}`,
      codePath: path.join(__dirname, "../../../lambdas/embedding"),
      timeout: cdk.Duration.minutes(5),
      memorySize: 512,
      environment: {
        S3_VECTOR_BUCKET_ARN: props.storage.privateRealm.vectorBucketArn,
        S3_VECTOR_BUCKET_NAME: props.storage.privateRealm.vectorBucketName,
        TEXT_EMBEDDINGS_INDEX_NAME:
          props.storage.privateRealm.textEmbeddingIndexName,
        LLM_SECRET_ARN: dependentStacks.secret.llmApiKeysSecret.secretArn,
      },
      description:
        "TypeScript-based lambda function for generating embeddings in the private realm to a S3 Vector bucket",
    });
    this.embeddingLambda.lambdaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3vectors:*"],
        resources: [`${props.storage.privateRealm.vectorBucketArn}/index/*`],
      }),
    );
    this.embeddingLambda.lambdaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["secretsmanager:GetSecretValue"],
        resources: [dependentStacks.secret.llmApiKeysSecret.secretArn],
      }),
    );

    this.contentStreamPipe = this.enableContentStreaming();

    // Output important resource information
    new cdk.CfnOutput(this, "PrivateStorageBucketName", {
      value: this.privateStorageBucket.bucket.bucketName,
      description: "Name of the private storage S3 bucket",
      exportName: `${S3BucketPrefixes.PRIVATE_OBJECT}-bucket-${props.environment}`,
    });

    new cdk.CfnOutput(this, "EmbeddingLambdaArn", {
      value: this.embeddingLambda.lambdaFunction.functionArn,
      description: "ARN of the embedding lambda function",
      exportName: `private-realm-embedding-lambda-${props.environment}`,
    });

    new cdk.CfnOutput(this, "EventsTableName", {
      value: this.eventsTable.table.tableName,
      description: "Name of the events DynamoDB table",
      exportName: `${DynamoDBTablePrefixes.PRIVATE_EVENT}-table-${props.environment}`,
    });

    new cdk.CfnOutput(this, "ContentTableName", {
      value: this.contentTable.table.tableName,
      description: "Name of the content DynamoDB table",
      exportName: `${DynamoDBTablePrefixes.PRIVATE_CONTENT}-table-${props.environment}`,
    });

    new cdk.CfnOutput(this, "FlexSearchTableName", {
      value: this.flexSearchTable.table.tableName,
      description: "Name of the FlexSearch DynamoDB table",
      exportName: `${DynamoDBTablePrefixes.PRIVATE_FLEXSEARCH}-table-${props.environment}`,
    });

    // Add tags to all resources
    cdk.Tags.of(this).add("Project", "PrivateRealm");
  }

  /**
   * Enable content streaming to the BigRawBus using EventBridge Pipes
   *
   * @returns The created content stream pipe
   */
  private enableContentStreaming(): DynamoDBStreamToEventBridgePipes {
    // Create EventBridge Pipe for content table stream
    const contentStreamPipe = new DynamoDBStreamToEventBridgePipes(
      this,
      "ContentStreamPipe",
      {
        table: this.contentTable.table,
        eventBus: this.dependentStacks.eventManagement.bigRawBus.eventBus,
        pipeName: `private-content-stream-${this.props.environment}`,
        description: "Stream private realm content table changes to BigRawBus",
        environment: this.props.environment,

        // Optimize for content table workloads
        batchSize: 10,
        maximumBatchingWindow: cdk.Duration.seconds(1),
        parallelizationFactor: 2,

        // Filter out DELETE events for now, focus on content creation/updates
        filter: DynamoDBStreamToEventBridgePipes.createEventNameFilter(
          Object.values(DYNAMODB_EVENT_TYPE),
        ),

        // Transform events with metadata about the private realm
        inputTransformation:
          DynamoDBStreamToEventBridgePipes.createStandardTransformation(
            RawEventSource.DDB_STREAM,
            DynamoDBTablePrefixes.PRIVATE_CONTENT,
          ),
      },
    );

    // Output pipe information
    new cdk.CfnOutput(this, "PrivateContentPipeArn", {
      value: contentStreamPipe.pipe.pipeArn,
      description: "ARN of the private content stream pipe",
      exportName: `private-content-pipe-arn-${this.props.environment}`,
    });

    // Add tags for the pipe
    cdk.Tags.of(contentStreamPipe).add("Purpose", "Content-Stream-Processing");
    cdk.Tags.of(contentStreamPipe).add("ContentRealm", "Private");
    cdk.Tags.of(contentStreamPipe).add("EventDestination", "BigRawBus");

    return contentStreamPipe;
  }
}
