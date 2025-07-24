import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { IConstruct } from "constructs";

export interface LambdaObservabilityAspectProps {}

export class LambdaObservabilityAspect implements cdk.IAspect {
  constructor(readonly props: LambdaObservabilityAspectProps = {}) {}

  visit(node: IConstruct): void {
    if (node instanceof lambda.Function) {
      this.addPermissions(node);
    }
  }

  private addPermissions(lambdaFunction: lambda.Function): void {
    const metricsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "cloudwatch:PutMetricData",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
      resources: ["*"],
    });

    lambdaFunction.addToRolePolicy(metricsPolicy);
  }
}
