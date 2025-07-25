import { CfnOutput, Stack } from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";
import { StackDeploymentProps } from "../config";
import { EventTransformer } from "./constructs/event-transformer";
import { EventBusWithObservability } from "./constructs/eventbus";

type EventManagementStackProps = StackDeploymentProps;

export class EventManagementStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    readonly props: EventManagementStackProps,
  ) {
    super(scope, id, props);
    const debug = this.node.tryGetContext("DEBUG") === "TRUE";

    // Create the raw event bus
    const rawEventBusConstruct = new EventBusWithObservability(
      this,
      "RawEventBusWithObservability",
      {
        eventBusName: "BigRawBus",
        account: this.props.account,
        schemaDiscovery: true,
        debug,
      },
    );

    // Route S3 events from default event bus to raw event bus
    new events.Rule(this, "S3EventRule", {
      eventBus: events.EventBus.fromEventBusName(
        this,
        "DefaultEventBus",
        "default",
      ),
      eventPattern: {
        source: ["aws.s3"],
      },
      targets: [new targets.EventBus(rawEventBusConstruct.eventBus)],
    });

    // Create the structured event bus
    const structuredEventBusConstruct = new EventBusWithObservability(
      this,
      "StructuredEventBusWithObservability",
      {
        eventBusName: "BigStructuredBus",
        account: this.props.account,
        debug,
      },
    );

    // Create the event transformer that processes events from raw to structured bus
    const eventTransformer = new EventTransformer(this, "EventTransformer", {
      rawEventBus: rawEventBusConstruct.eventBus,
      structuredEventBus: structuredEventBusConstruct.eventBus,
    });

    // Outputs for easy reference
    new CfnOutput(this, "RawEventBusArn", {
      value: rawEventBusConstruct.eventBus.eventBusArn,
      description: "The ARN of the Raw EventBus",
      exportName: "BigRawBusArn",
    });

    new CfnOutput(this, "StructuredEventBusArn", {
      value: structuredEventBusConstruct.eventBus.eventBusArn,
      description: "The ARN of the Structured EventBus",
      exportName: "BigStructuredBusArn",
    });

    new CfnOutput(this, "EventTransformerFunctionArn", {
      value: eventTransformer.transformerFunction.lambdaFunction.functionArn,
      description: "The ARN of the Event Transformer Lambda function",
      exportName: "EventTransformerFunctionArn",
    });

    new CfnOutput(this, "EventTransformerDLQArn", {
      value: eventTransformer.deadLetterQueue.queueArn,
      description: "The ARN of the Event Transformer Dead Letter Queue",
      exportName: "EventTransformerDLQArn",
    });

    new CfnOutput(this, "EventTransformerRuleArn", {
      value: eventTransformer.eventRule.ruleArn,
      description: "The ARN of the Event Rule that triggers transformation",
      exportName: "EventTransformerRuleArn",
    });
  }
}
