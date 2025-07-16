import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EventManagementStack } from "./EventManagement";
import { KnowledgeGraphStack } from "./KnowledgeGraph";
import config from "./config";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BigCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deploymentProps = { ...props, ...config };

    // The code that defines your stack goes here
    const eventMessageStack = new EventManagementStack(
      this,
      "EventManagementStack",
      deploymentProps,
    );

    const knowledgeBaseStack = new KnowledgeGraphStack(
      this,
      "KnowledgeBaseStack",
      deploymentProps,
    );

    this.addDependency(eventMessageStack);
    this.addDependency(knowledgeBaseStack);
  }
}
