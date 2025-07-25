import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthenticationStack } from "./Authentication";
import { MonitoringAspect } from "./common/aspects/monitoring-aspect";
import config from "./config";
import { EventManagementStack } from "./EventManagement";
import { SecretsStack } from "./Secret";
import { PrivateRealmStack } from "./Storage/private-realm-stack";
import { PublicRealmStack } from "./Storage/public-realm-stack";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BigCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deploymentProps = { ...props, ...config };

    const secretStack = new SecretsStack(this, "SecretsStack", deploymentProps);

    const _authenticationStack = new AuthenticationStack(
      this,
      "AuthenticationStack",
      deploymentProps,
    );

    // The code that defines your stack goes here
    const eventManagementStack = new EventManagementStack(
      this,
      "EventManagementStack",
      deploymentProps,
    );

    // Private Realm Stack for content storage, embeddings, and search
    const privateRealmStack = new PrivateRealmStack(
      this,
      "PrivateRealmStack",
      deploymentProps,
      {
        secret: secretStack,
        eventManagement: eventManagementStack,
      },
    );

    const publicRealmStack = new PublicRealmStack(
      this,
      "PublicRealmStack",
      deploymentProps,
      {
        eventManagement: eventManagementStack,
      },
    );

    privateRealmStack.addDependency(secretStack);
    privateRealmStack.addDependency(eventManagementStack);
    publicRealmStack.addDependency(eventManagementStack);

    cdk.Aspects.of(this).add(new MonitoringAspect());
  }
}
