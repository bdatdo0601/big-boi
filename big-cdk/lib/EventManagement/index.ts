import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as schemas from 'aws-cdk-lib/aws-eventschemas';
import { Construct } from 'constructs';

export class EventManagementStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an EventBus with schema discovery enabled
    const eventBus = new events.EventBus(this, 'MyEventBus', {
      eventBusName: 'MyCustomEventBus'
    });

    // Enable schema discovery
    const discoverer = new schemas.CfnDiscoverer(this, 'SchemaDiscoverer', {
      sourceArn: eventBus.eventBusArn,
      description: 'Schema discoverer for MyCustomEventBus'
    });

    // Output the EventBus ARN
    new cdk.CfnOutput(this, 'EventBusArn', {
      value: eventBus.eventBusArn,
      description: 'The ARN of the EventBus',
    });

    // Output the Schema Discoverer ID
    new cdk.CfnOutput(this, 'SchemaDiscovererId', {
      value: discoverer.attrDiscovererId,
      description: 'The ID of the Schema Discoverer',
    });
  }
}
