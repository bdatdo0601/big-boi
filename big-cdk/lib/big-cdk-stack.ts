import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import config from './config';
import { EventManagementStack } from './EventManagement';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BigCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deploymentProps = { ...props, ...config };

    // The code that defines your stack goes here
    const _eventMessageStack = new EventManagementStack(this, 'EventManagementStack', deploymentProps);

    // Remove these lines - they create circular dependencies!
    // this.addDependency(eventMessageStack);
    // this.addDependency(knowledgeBaseStack);
  }
}
