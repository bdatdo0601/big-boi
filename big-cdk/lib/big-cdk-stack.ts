import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EventManagementStack } from './EventManagement';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BigCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const eventMessageStack = new EventManagementStack(this, 'EventManagementStack', props);

    this.addDependency(eventMessageStack);
  }
}
