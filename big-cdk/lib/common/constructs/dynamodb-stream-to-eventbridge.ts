import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";

export interface DynamoDBStreamToEventBridgeProps {
  table: dynamodb.Table;
  eventBus: events.EventBus;
  functionName: string;
  eventSource: string;
  eventDetailType: string;
  environment?: string;
}

export class DynamoDBStreamToEventBridge extends Construct {
  public readonly streamProcessor: lambda.Function;

  constructor(
    scope: Construct,
    id: string,
    props: DynamoDBStreamToEventBridgeProps,
  ) {
    super(scope, id);

    // Create the Lambda function that processes DynamoDB stream events
    this.streamProcessor = new lambda.Function(this, "StreamProcessor", {
      functionName: props.functionName,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
const { EventBridge } = require('@aws-sdk/client-eventbridge');

const eventBridge = new EventBridge();

exports.handler = async (event) => {
    console.log('Received DynamoDB Stream event:', JSON.stringify(event, null, 2));
    
    const events = [];
    
    for (const record of event.Records) {
        // Only process INSERT, MODIFY, and REMOVE events
        if (['INSERT', 'MODIFY', 'REMOVE'].includes(record.eventName)) {
            const eventEntry = {
                Source: '${props.eventSource}',
                DetailType: '${props.eventDetailType}',
                Detail: JSON.stringify({
                    eventName: record.eventName,
                    dynamodb: record.dynamodb,
                    eventSourceARN: record.eventSourceARN,
                    awsRegion: record.awsRegion,
                    eventID: record.eventID,
                    timestamp: new Date().toISOString()
                }),
                EventBusName: '${props.eventBus.eventBusName}'
            };
            events.push(eventEntry);
        }
    }
    
    if (events.length > 0) {
        // Send events to EventBridge in batches of 10 (EventBridge limit)
        const batches = [];
        for (let i = 0; i < events.length; i += 10) {
            batches.push(events.slice(i, i + 10));
        }
        
        for (const batch of batches) {
            try {
                const result = await eventBridge.putEvents({
                    Entries: batch
                });
                console.log('Successfully sent events to EventBridge:', result);
            } catch (error) {
                console.error('Error sending events to EventBridge:', error);
                throw error;
            }
        }
    }
    
    return { statusCode: 200, body: \`Processed \${event.Records.length} records\` };
};
      `),
      environment: {
        EVENT_BUS_NAME: props.eventBus.eventBusName,
        EVENT_SOURCE: props.eventSource,
        EVENT_DETAIL_TYPE: props.eventDetailType,
      },
      timeout: cdk.Duration.minutes(1),
      memorySize: 256,
      description: `Processes DynamoDB stream events from ${props.table.tableName} and sends them to EventBridge`,
    });

    // Grant permissions to send events to EventBridge
    this.streamProcessor.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["events:PutEvents"],
        resources: [props.eventBus.eventBusArn],
      }),
    );

    // Add DynamoDB stream as event source
    this.streamProcessor.addEventSource(
      new lambdaEventSources.DynamoEventSource(props.table, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        batchSize: 10,
        maxBatchingWindow: cdk.Duration.seconds(5),
        retryAttempts: 3,
      }),
    );

    // Output the function ARN
    new cdk.CfnOutput(this, "StreamProcessorArn", {
      value: this.streamProcessor.functionArn,
      description: `ARN of the stream processor function for ${props.table.tableName}`,
      exportName: `${props.functionName}-arn-${props.environment || "dev"}`,
    });
  }
}
