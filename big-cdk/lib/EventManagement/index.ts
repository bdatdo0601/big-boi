import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EventBusWithObservability } from "./constructs/eventbus";

type EventManagementStackProps = StackProps & {
  account: string;
};

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
