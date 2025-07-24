import * as cdk from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export class SecretsStack extends cdk.Stack {
  public readonly llmApiKeysSecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a secret to store all LLM API keys
    this.llmApiKeysSecret = new secretsmanager.Secret(
      this,
      "LLMApiKeysSecret",
      {
        secretName: "llm-api-keys",
        description:
          "API keys for various LLM providers (Mistral, Anthropic, etc.)",
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            MISTRAL_API_KEY: "placeholder",
            ANTHROPIC_API_KEY: "placeholder",
          }),
          generateStringKey: "placeholder",
          excludeCharacters: '"\\/@',
        },
      },
    );

    // Output the secret ARN for reference
    new cdk.CfnOutput(this, "LLMApiKeysSecretArn", {
      value: this.llmApiKeysSecret.secretArn,
      description: "ARN of the LLM API keys secret",
    });
  }
}
