#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { BigCdkStack } from "../lib/big-cdk-stack";
import { KhojStack } from "../lib/khoj-stack";
import { AwsSolutionsChecks } from "cdk-nag";

const app = new cdk.App();

// Apply CDK Nag for security best practices
// AwsSolutionsChecks.check(app);

new BigCdkStack(app, "BigCdkStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: {
    account: process.env.CDK_TARGET_ACCOUNT,
    region: process.env.CDK_TARGET_REGION,
  },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

// new KhojStack(app, 'KhojStack', {
//   env: { account: process.env.CDK_TARGET_ACCOUNT, region: process.env.CDK_TARGET_REGION },
// });
