import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

export class SecretManager {
  private client: SecretsManagerClient;

  constructor(region?: string) {
    this.client = new SecretsManagerClient({
      region: region || process.env.AWS_REGION || "us-east-1",
    });
  }

  async getSecret(secretName: string, key?: string): Promise<string> {
    try {
      const command = new GetSecretValueCommand({
        SecretId: secretName,
      });

      const response = await this.client.send(command);

      if (!response.SecretString) {
        throw new Error(`Secret ${secretName} does not contain a string value`);
      }

      if (key) {
        // Parse as JSON and return specific key
        try {
          const secretObject = JSON.parse(response.SecretString);
          if (!(key in secretObject)) {
            throw new Error(`Key '${key}' not found in secret ${secretName}`);
          }
          return secretObject[key];
        } catch (parseError) {
          throw new Error(
            `Failed to parse secret ${secretName} as JSON: ${parseError}`,
          );
        }
      } else {
        // Return plain text
        return response.SecretString;
      }
    } catch (error) {
      throw new Error(`Failed to retrieve secret ${secretName}: ${error}`);
    }
  }
}

// Convenience function for one-off usage
export async function getSecret(
  secretName: string,
  key?: string,
  region?: string,
): Promise<string> {
  const secretManager = new SecretManager(region);
  return secretManager.getSecret(secretName, key);
}
