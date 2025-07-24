import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthenticationStack } from "./Authentication";
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
    const _eventMessageStack = new EventManagementStack(
      this,
      "EventManagementStack",
      deploymentProps,
    );

    // Private Realm Stack for content storage, embeddings, and search
    const _privateRealmStack = new PrivateRealmStack(
      this,
      "PrivateRealmStack",
      deploymentProps,
      { secret: secretStack },
    );

    const _publicRealmStack = new PublicRealmStack(
      this,
      "PublicRealmStack",
      deploymentProps,
    );
  }
}
