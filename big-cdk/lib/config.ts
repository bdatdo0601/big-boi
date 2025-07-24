import { StackProps } from "aws-cdk-lib";

enum ENVIRONMENT {
  DEV = "dev",
}

// Option 2: Type guard (safer)
function isValidEnvironment(env?: string): env is ENVIRONMENT {
  return env !== undefined && Object.keys(ENVIRONMENT).includes(env); // Adjust based on your ENVIRONMENT type
}

export const Environment: ENVIRONMENT = isValidEnvironment(
  process.env.ENVIRONMENT,
)
  ? process.env.ENVIRONMENT
  : ENVIRONMENT.DEV;

export type StackDeploymentProps = StackProps & {
  account: string;
  region: string;
  environment: string;
  storage: {
    privateRealm: {
      // Currently S3 Vector does not support CDK automated deployment. Created via console and pass in the ARN instead
      vectorBucketArn: string;
      vectorBucketName: string;
      textEmbeddingIndexName: string;
    };
  };
};

const configs: { [key in ENVIRONMENT]: StackDeploymentProps } = {
  [ENVIRONMENT.DEV]: {
    account: "142037127835",
    region: "us-east-1",
    environment: "dev",
    storage: {
      privateRealm: {
        vectorBucketArn:
          "arn:aws:s3vectors:us-east-1:142037127835:bucket/big-s3-vector-bucket",
        vectorBucketName: "big-s3-vector-bucket",
        textEmbeddingIndexName: "text-embeddings",
      },
    },
  },
};

export default configs[Environment];
