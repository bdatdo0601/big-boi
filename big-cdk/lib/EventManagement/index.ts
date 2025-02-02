import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as pipes from 'aws-cdk-lib/aws-pipes';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import { Construct } from 'constructs';

type EventManagementStackProps = cdk.StackProps & {
  ingestionKinesisStreamArn: string;
};

export class EventManagementStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    readonly props: EventManagementStackProps
  ) {
    super(scope, id, props);

    const eventBus = new events.EventBus(this, 'MyEventBus', {
      eventBusName: 'MyCustomEventBus',
    });

    const kinesisStream = kinesis.Stream.fromStreamArn(
      this,
      'ImportedKinesisStream',
      this.props.ingestionKinesisStreamArn
    );

    const pipe = new pipes.CfnPipe(this, 'EventBridgeToPipe', {
      source: kinesisStream.streamArn,
      target: eventBus.eventBusArn,
      roleArn: new cdk.aws_iam.Role(this, 'PipeRole', {
        assumedBy: new cdk.aws_iam.ServicePrincipal('pipes.amazonaws.com'),
        inlinePolicies: {
          KinesisAccess: new cdk.aws_iam.PolicyDocument({
            statements: [
              new cdk.aws_iam.PolicyStatement({
                actions: [
                  'kinesis:DescribeStream',
                  'kinesis:GetShardIterator',
                  'kinesis:GetRecords',
                  'kinesis:ListShards',
                ],
                resources: [kinesisStream.streamArn],
              }),
            ],
          }),
          EventBridgeAccess: new cdk.aws_iam.PolicyDocument({
            statements: [
              new cdk.aws_iam.PolicyStatement({
                actions: ['events:PutEvents'],
                resources: [eventBus.eventBusArn],
              }),
            ],
          }),
        },
      }).roleArn,
      sourceParameters: {
        kinesisStreamParameters: {
          startingPosition: 'LATEST',
          batchSize: 10,
          maximumBatchingWindowInSeconds: 5,
        },
      },
      targetParameters: {
        eventBridgeEventBusParameters: {
          detailType: 'KinesisEvent',
          source: 'KinesisStream',
        },
        inputTemplate: `
          {
            "detailType": "KinesisEvent",
            "id": <$.eventID>,
            "source": "<$.eventSource>",
            "time": <$.approximateArrivalTimestamp>,
            "data": <$.data>,
            "partitionKey": <$.partitionKey>
            "sourceArn": <$.eventSourceARN>,
          }
        `,
      },
    });
    new cdk.CfnOutput(this, 'EventBusArn', {
      value: eventBus.eventBusArn,
      description: 'The ARN of the EventBus',
    });

    new cdk.CfnOutput(this, 'PipeArn', {
      value: pipe.attrArn,
      description: 'The ARN of the EventBridge Pipe',
    });
  }
}
