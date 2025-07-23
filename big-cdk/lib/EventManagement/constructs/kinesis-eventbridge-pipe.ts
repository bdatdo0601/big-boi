import * as cdk from "aws-cdk-lib";
import * as kinesis from "aws-cdk-lib/aws-kinesis";
import * as pipes from "aws-cdk-lib/aws-pipes";
import { Construct } from "constructs";

// Kinesis to EventBridge Pipe construct
export class KinesisToEventBridgePipe extends Construct {
  public readonly pipe: pipes.CfnPipe;
  public readonly dlq: cdk.aws_sqs.Queue;

  constructor(
    scope: Construct,
    id: string,
    props: {
      sourceStreamArn: string;
      targetEventBusArn: string;
    },
  ) {
    super(scope, id);

    const dlq = new cdk.aws_sqs.Queue(this, "PipeDLQ", {
      retentionPeriod: cdk.Duration.days(1),
    });

    const kinesisStream = kinesis.Stream.fromStreamArn(
      this,
      "ImportedKinesisStream",
      props.sourceStreamArn,
    );

    const logGroup = new cdk.aws_logs.LogGroup(this, "PipeLogGroup", {
      retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
    });

    const pipeRole = new cdk.aws_iam.Role(this, "PipeRole", {
      assumedBy: new cdk.aws_iam.ServicePrincipal("pipes.amazonaws.com"),
      inlinePolicies: {
        KinesisAccess: new cdk.aws_iam.PolicyDocument({
          statements: [
            new cdk.aws_iam.PolicyStatement({
              actions: [
                "kinesis:DescribeStream",
                "kinesis:GetShardIterator",
                "kinesis:GetRecords",
                "kinesis:ListShards",
              ],
              resources: [kinesisStream.streamArn],
            }),
          ],
        }),
        EventBridgeAccess: new cdk.aws_iam.PolicyDocument({
          statements: [
            new cdk.aws_iam.PolicyStatement({
              actions: ["events:PutEvents"],
              resources: [props.targetEventBusArn],
            }),
          ],
        }),
        CloudWatchLogsAccess: new cdk.aws_iam.PolicyDocument({
          statements: [
            new cdk.aws_iam.PolicyStatement({
              actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
              resources: [logGroup.logGroupArn],
            }),
          ],
        }),
        SQSAccess: new cdk.aws_iam.PolicyDocument({
          statements: [
            new cdk.aws_iam.PolicyStatement({
              actions: ["sqs:SendMessage"],
              resources: [dlq.queueArn],
            }),
          ],
        }),
      },
    });

    this.pipe = new pipes.CfnPipe(this, "EventBridgeToPipe", {
      source: kinesisStream.streamArn,
      target: props.targetEventBusArn,
      roleArn: pipeRole.roleArn,
      sourceParameters: {
        kinesisStreamParameters: {
          startingPosition: "LATEST",
          batchSize: 10,
          maximumBatchingWindowInSeconds: 5,
        },
      },
      targetParameters: {
        eventBridgeEventBusParameters: {
          detailType: "KinesisEvent",
          source: "KinesisStream",
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
        level: "ERROR",
      },
    });
  }
}
