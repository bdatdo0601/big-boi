import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import * as path from "path";
import { DynamoDBTable } from "../common/constructs/dynamodb-table";
import { S3BucketConstruct } from "../common/constructs/s3-bucket";
import { TypeScriptLambda } from "../common/constructs/ts-lambda";
import { StackDeploymentProps } from "../config";
import { SecretsStack } from "../Secret";

export type PrivateRealmStackProps = StackDeploymentProps & {
  environment: string;
};

export class PrivateRealmStack extends cdk.Stack {
  public readonly privateStorageBucket: s3.Bucket;
  public readonly eventsTable: dynamodb.Table;
  public readonly contentTable: dynamodb.Table;
  public readonly flexSearchTable: dynamodb.Table;
  public readonly embeddingLambda: lambda.Function;

  constructor(
    scope: Construct,
    id: string,
    props: PrivateRealmStackProps,
    readonly dependentStacks: { secret: SecretsStack },
  ) {
    super(scope, id, props);

    // Create private storage bucket using S3BucketConstruct
    const privateStorage = new S3BucketConstruct(this, "PrivateStorage", {
      environment: props.environment,
      bucketName: `private-realm-storage-${props.environment}`,
      lifecycleRules: [
        {
          id: "archive-old-versions",
          noncurrentVersionExpiration: cdk.Duration.days(14),
          enabled: true,
        },
      ],
    });
    this.privateStorageBucket = privateStorage.bucket;

    // DynamoDB Table for Events
    const eventsTableConstruct = new DynamoDBTable(this, "EventsTable", {
      tableName: `private-realm-events-${props.environment}`,
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
      tableName: `private-realm-content-${props.environment}`,
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
        tableName: `private-realm-flexsearch-${props.environment}`,
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

    // Create embedding lambda using TypeScriptLambda construct
    const embeddingLambda = new TypeScriptLambda(this, "EmbeddingLambda", {
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
    this.embeddingLambda = embeddingLambda.lambdaFunction;
    this.embeddingLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3vectors:*"],
        resources: [`${props.storage.privateRealm.vectorBucketArn}/index/*`],
      }),
    );
    this.embeddingLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["secretsmanager:GetSecretValue"],
        resources: [dependentStacks.secret.llmApiKeysSecret.secretArn],
      }),
    );

    // Output important resource information
    new cdk.CfnOutput(this, "PrivateStorageBucketName", {
      value: this.privateStorageBucket.bucketName,
      description: "Name of the private storage S3 bucket",
      exportName: `private-realm-storage-bucket-${props.environment}`,
    });

    new cdk.CfnOutput(this, "EmbeddingLambdaArn", {
      value: this.embeddingLambda.functionArn,
      description: "ARN of the embedding lambda function",
      exportName: `private-realm-embedding-lambda-${props.environment}`,
    });

    new cdk.CfnOutput(this, "EventsTableName", {
      value: this.eventsTable.tableName,
      description: "Name of the events DynamoDB table",
      exportName: `private-realm-events-table-${props.environment}`,
    });

    new cdk.CfnOutput(this, "ContentTableName", {
      value: this.contentTable.tableName,
      description: "Name of the content DynamoDB table",
      exportName: `private-realm-content-table-${props.environment}`,
    });

    new cdk.CfnOutput(this, "FlexSearchTableName", {
      value: this.flexSearchTable.tableName,
      description: "Name of the FlexSearch DynamoDB table",
      exportName: `private-realm-flexsearch-table-${props.environment}`,
    });

    // Add tags to all resources
    cdk.Tags.of(this).add("Project", "PrivateRealm");
  }
}
