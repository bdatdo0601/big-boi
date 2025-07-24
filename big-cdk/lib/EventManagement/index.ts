import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { StackDeploymentProps } from "../config";
import { EventBusWithObservability } from "./constructs/eventbus";

type EventManagementStackProps = StackDeploymentProps;

export class EventManagementStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    readonly props: EventManagementStackProps,
  ) {
    super(scope, id, props);

    const eventBusConstruct = new EventBusWithObservability(
      this,
      "EventBusWithObservability",
      {
        eventBusName: "BigEventBus",
        account: this.props.account,
      },
    );

    new CfnOutput(this, "EventBusArn", {
      value: eventBusConstruct.eventBus.eventBusArn,
      description: "The ARN of the EventBus",
    });
  }
}
