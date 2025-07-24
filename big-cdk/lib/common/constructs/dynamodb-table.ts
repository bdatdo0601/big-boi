import * as cdk from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  PointInTimeRecoverySpecification,
  ProjectionType,
  Table,
  TableEncryption,
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
}

export class DynamoDBTable extends Construct {
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: DynamoDBTableProps) {
    super(scope, id);

    this.table = new Table(this, "Table", {
      tableName: props.tableName,
      partitionKey: props.partitionKey,
      sortKey: props.sortKey,
      billingMode: props.billingMode || BillingMode.PAY_PER_REQUEST,
      encryption: props.encryption || TableEncryption.AWS_MANAGED,
      removalPolicy: props.removalPolicy || cdk.RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: false,
      },
    });

    // Add Global Secondary Indexes if provided
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
