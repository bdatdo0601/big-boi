import * as cdk from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  StreamViewType,
  TableEncryption,
  TableV2,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface DynamoDBTableGSI {
  indexName: string;
  partitionKey: {
    name: string;
    type: AttributeType;
  };
  sortKey?: {
    name: string;
    type: AttributeType;
  };
  projectionType?: ProjectionType;
  nonKeyAttributes?: string[];
}

export interface DynamoDBTableProps {
  tableName: string;
  partitionKey: {
    name: string;
    type: AttributeType;
  };
  sortKey?: {
    name: string;
    type: AttributeType;
  };
  billingMode?: BillingMode;
  encryption?: TableEncryption;
  removalPolicy?: cdk.RemovalPolicy;
  pointInTimeRecovery?: boolean;
  globalSecondaryIndexes: DynamoDBTableGSI[];
  environment?: string;
  /**
   * Enable DynamoDB Streams to capture data modification events
   * @default undefined - no streams
   */
  dynamoStream?: StreamViewType;
}

export class DynamoDBTable extends Construct {
  public readonly table: TableV2;

  constructor(scope: Construct, id: string, props: DynamoDBTableProps) {
    super(scope, id);

    // If streams are enabled, use TableV2 (required for EventBridge Pipes)
    this.table = new TableV2(this, "TableV2", {
      tableName: props.tableName,
      partitionKey: props.partitionKey,
      sortKey: props.sortKey,
      billing:
        props.billingMode === BillingMode.PAY_PER_REQUEST
          ? cdk.aws_dynamodb.Billing.onDemand()
          : cdk.aws_dynamodb.Billing.provisioned({
              readCapacity: cdk.aws_dynamodb.Capacity.fixed(5),
              writeCapacity: cdk.aws_dynamodb.Capacity.autoscaled({
                maxCapacity: 15,
              }),
            }),
      encryption: cdk.aws_dynamodb.TableEncryptionV2.awsManagedKey(),
      removalPolicy: props.removalPolicy || cdk.RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: props.pointInTimeRecovery || false,
      },
      dynamoStream: props.dynamoStream,
    });

    // Add Global Secondary Indexes to TableV2
    props.globalSecondaryIndexes.forEach((gsi) => {
      this.table.addGlobalSecondaryIndex({
        indexName: gsi.indexName,
        partitionKey: gsi.partitionKey,
        sortKey: gsi.sortKey,
        projectionType: gsi.projectionType || ProjectionType.ALL,
        nonKeyAttributes: gsi.nonKeyAttributes,
      });
    });
  }
}
