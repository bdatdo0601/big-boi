import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface SecretsStackProps {
  // No additional props needed for now
}

export class SecretsStack extends Construct {
  public readonly dbCredentials: secretsmanager.Secret;
  public readonly djangoSecret: secretsmanager.Secret;
  public readonly adminSecret: secretsmanager.Secret;
  public readonly anthropicApiKeySecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: SecretsStackProps) {
    super(scope, id);

    // Create database credentials secret
    this.dbCredentials = new secretsmanager.Secret(this, 'KhojDbCredentials', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
        passwordLength: 32,
      },
      description: 'Khoj Aurora PostgreSQL database credentials',
    });

    // Create Django secret key
    this.djangoSecret = new secretsmanager.Secret(this, 'KhojDjangoSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ key: 'django-secret-key' }),
        generateStringKey: 'value',
        excludeCharacters: '"@/\\',
        passwordLength: 50,
      },
      description: 'Khoj Django application secret key',
    });

    // Create admin credentials secret
    this.adminSecret = new secretsmanager.Secret(this, 'KhojAdminSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          email: 'dat.b.do@gmail.com',
        }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
        passwordLength: 20,
      },
      description: 'Khoj admin user credentials',
    });

    // Create Anthropic API key secret (placeholder)
    this.anthropicApiKeySecret = new secretsmanager.Secret(this, 'KhojAnthropicApiKey', {
      secretStringValue: cdk.SecretValue.unsafePlainText('placeholder-anthropic-api-key'),
      description: 'Anthropic API key for Khoj AI features',
    });

    // Outputs
    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: this.dbCredentials.secretArn,
      description: 'Database credentials secret ARN',
    });

    new cdk.CfnOutput(this, 'DjangoSecretArn', {
      value: this.djangoSecret.secretArn,
      description: 'Django secret key ARN',
    });

    new cdk.CfnOutput(this, 'AdminSecretArn', {
      value: this.adminSecret.secretArn,
      description: 'Admin credentials secret ARN',
    });

    new cdk.CfnOutput(this, 'AnthropicApiKeySecretArn', {
      value: this.anthropicApiKeySecret.secretArn,
      description: 'Anthropic API key secret ARN',
    });
  }
}
