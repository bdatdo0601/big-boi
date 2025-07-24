import * as cdk from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import * as path from "path";
import { TypeScriptLambda } from "../../common/constructs/ts-lambda";

export interface EventTransformerProps {
  rawEventBus: events.EventBus;
  structuredEventBus: events.EventBus;
}

export class EventTransformer extends Construct {
  public readonly transformerFunction: TypeScriptLambda;
  public readonly eventRule: events.Rule;
  public readonly deadLetterQueue: sqs.Queue;

  constructor(scope: Construct, id: string, props: EventTransformerProps) {
    super(scope, id);

    // Create Dead Letter Queue for failed event processing
    this.deadLetterQueue = new sqs.Queue(this, "EventTransformerDLQ", {
      queueName: "event-transformer-dlq",
      retentionPeriod: cdk.Duration.days(14),
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // Create the event transformer Lambda function using TypeScript
    this.transformerFunction = new TypeScriptLambda(
      this,
      "EventTransformerFunction",
      {
        functionName: "event-transformer",
        codePath: path.join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "lambdas",
          "event-transformer",
        ),
        timeout: cdk.Duration.seconds(30),
        memorySize: 256,
        environment: {
          STRUCTURED_BUS_NAME: props.structuredEventBus.eventBusName,
        },
        description: "Transforms raw events into structured format",
      },
    );

    // Grant permissions for the Lambda to publish events to the structured bus
    props.structuredEventBus.grantPutEventsTo(
      this.transformerFunction.lambdaFunction,
    );

    // Create event rule to capture all events from raw event bus
    this.eventRule = new events.Rule(this, "CaptureAllRawEventsRule", {
      eventBus: props.rawEventBus,
      description: "Captures all events from raw bus for transformation",
      eventPattern: {
        // This pattern matches all events on the bus
        account: [cdk.Stack.of(this).account],
      },
      targets: [
        new targets.LambdaFunction(this.transformerFunction.lambdaFunction, {
          retryAttempts: 3,
          deadLetterQueue: this.deadLetterQueue,
        }),
      ],
    });

    // Add tags for better resource management
    cdk.Tags.of(this).add("Component", "EventTransformer");
    cdk.Tags.of(this).add("Purpose", "EventProcessing");
  }
}
