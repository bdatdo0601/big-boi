import * as cdk from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import { Effect } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

// Enhanced EventBus construct with observability features
export class EventBusWithObservability extends Construct {
  public readonly eventBus: events.EventBus;

  constructor(
    scope: Construct,
    id: string,
    props: {
      eventBusName: string;
      account: string;
    },
  ) {
    super(scope, id);
    this.eventBus = new events.EventBus(this, "EventBus", {
      eventBusName: props.eventBusName,
    });
    const _eventBusPolicy = new events.EventBusPolicy(this, "EventBusPolicy", {
      eventBus: this.eventBus,
      statementId: "AllowAnyServicePublishingToEventBus",
      statement: new cdk.aws_iam.PolicyStatement({
        sid: "AllowAnyServicePublishingToEventBus",
        effect: Effect.ALLOW,
        actions: ["events:PutEvents"],
        principals: [new cdk.aws_iam.AccountRootPrincipal()],
        resources: [this.eventBus.eventBusArn],
      }).toJSON(),
    });

    // Add schema discovery
    const _schemaRegistry = new cdk.aws_eventschemas.CfnRegistry(
      this,
      "SchemaRegistry",
      {},
    );

    const _discoverer = new cdk.aws_eventschemas.CfnDiscoverer(
      this,
      "SchemaDiscoverer",
      {
        sourceArn: this.eventBus.eventBusArn,
        description: `Schema discoverer for ${props.eventBusName}`,
      },
    );

    // Add logging
    const eventBusLogGroup = new cdk.aws_logs.LogGroup(
      this,
      "EventBusLogGroup",
      {
        retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    const _rule = new events.Rule(this, "LogAllEventsRule", {
      eventBus: this.eventBus,
      eventPattern: {
        account: [props.account],
      },
      targets: [
        new cdk.aws_events_targets.CloudWatchLogGroup(eventBusLogGroup),
      ],
    });
  }
}
