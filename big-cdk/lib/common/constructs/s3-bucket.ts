import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
export interface S3BucketProps {
  environment: string;
  bucketName: string;
  versioned?: boolean;
  encryption?: s3.BucketEncryption;
  blockPublicAccess?: s3.BlockPublicAccess;
  lifecycleRules?: s3.LifecycleRule[];
  eventBridgeEnabled?: boolean;
}

export class S3BucketConstruct extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3BucketProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, "S3Bucket", {
      bucketName: props.bucketName,
      versioned: props.versioned ?? true,
      encryption: props.encryption ?? s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess:
        props.blockPublicAccess ?? s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: props.lifecycleRules ?? [
        {
          id: "archive-old-versions",
          noncurrentVersionExpiration: cdk.Duration.days(90),
          enabled: true,
        },
      ],
      eventBridgeEnabled: props.eventBridgeEnabled ?? true,
    });
  }
}
