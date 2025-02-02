import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as pipes from 'aws-cdk-lib/aws-pipes';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import { Construct } from 'constructs';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Effect } from 'aws-cdk-lib/aws-iam';

type EventManagementStackProps = cdk.StackProps & {
  ingestionKinesisStreamArn: string;
  ingestionLambdaArn: string;
  account: string;
};

export class EventManagementStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    readonly props: EventManagementStackProps
  ) {
    super(scope, id, props);

    const dlq = new cdk.aws_sqs.Queue(this, 'EventBusDLQ', {
      queueName: 'EventBusDLQ',
      retentionPeriod: cdk.Duration.days(14),
    });

    const eventBus = new events.EventBus(this, 'MyEventBus', {
      eventBusName: 'BigBus',
      deadLetterQueue: dlq,
    });

    const eventBusPolicy = new events.EventBusPolicy(this, 'EventBusPolicy', {
      eventBus: eventBus,
      statementId: 'AllowPublishingToEventBus',
      statement: new cdk.aws_iam.PolicyStatement({
        sid: 'AllowPublishingToEventBus',
        effect: Effect.ALLOW,
        actions: ['events:PutEvents'],
        principals: [new cdk.aws_iam.AccountRootPrincipal()],
        resources: [eventBus.eventBusArn],
      }).toJSON(),
    });

    // Add schema discovery
    const schemaRegistry = new cdk.aws_eventschemas.CfnRegistry(this, 'SchemaRegistry', {
      registryName: 'BigBusSchemaRegistry',
    });

    const discoverer = new cdk.aws_eventschemas.CfnDiscoverer(this, 'SchemaDiscoverer', {
      sourceArn: eventBus.eventBusArn,
      description: 'Schema discoverer for BigBus',
    });

    // Add logging
    const eventBusLogGroup = new cdk.aws_logs.LogGroup(this, 'EventBusLogGroup', {
      logGroupName: '/aws/events/BigBus',
      retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const rule = new events.Rule(this, 'LogAllEventsRule', {
      eventBus: eventBus,
      eventPattern: {
        account: [this.account],
      },
      targets: [new cdk.aws_events_targets.CloudWatchLogGroup(eventBusLogGroup)],
    });

    const kinesisStream = kinesis.Stream.fromStreamArn(
      this,
      'ImportedKinesisStream',
      this.props.ingestionKinesisStreamArn
    );
    const logGroup = new cdk.aws_logs.LogGroup(this, 'PipeLogGroup', {
      retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
    });

    const pipeRole = new cdk.aws_iam.Role(this, 'PipeRole', {
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
        CloudWatchLogsAccess: new cdk.aws_iam.PolicyDocument({
          statements: [
            new cdk.aws_iam.PolicyStatement({
              actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
              resources: [logGroup.logGroupArn],
            }),
          ],
        }),
        SQSAccess: new cdk.aws_iam.PolicyDocument({
          statements: [
            new cdk.aws_iam.PolicyStatement({
              actions: ['sqs:SendMessage'],
              resources: [dlq.queueArn],
            }),
          ],
        }),
      },
    });

    const pipe = new pipes.CfnPipe(this, 'EventBridgeToPipe', {
      source: kinesisStream.streamArn,
      target: eventBus.eventBusArn,
      roleArn: pipeRole.roleArn,
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
        "id": "<$.eventID>",
        "source": "<$.eventSource>",
        "time": "<$.approximateArrivalTimestamp>",
        "data": <$.data>,
        "partitionKey": <$.partitionKey>,
        "sourceArn": "<$.eventSourceARN>",
        "approximateArrivalTimestamp": <$.approximateArrivalTimestamp>,
        "eventVersion": <$.eventVersion>
      }
    `,
      },
      logConfiguration: {
        cloudwatchLogsLogDestination: {
          logGroupArn: logGroup.logGroupArn,
        },
        level: 'ERROR',
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
