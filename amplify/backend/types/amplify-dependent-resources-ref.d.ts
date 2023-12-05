export type AmplifyDependentResourcesAttributes = {
  "analytics": {
    "bigboianalytics": {
      "Id": "string",
      "Region": "string",
      "appName": "string"
    },
    "bigboidefaultkinesis": {
      "kinesisStreamArn": "string",
      "kinesisStreamId": "string",
      "kinesisStreamShardCount": "string"
    },
    "bigboinotification": {
      "snsTopicArn": "string",
      "snsTopicName": "string"
    }
  },
  "api": {
    "bigboiapi": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    },
    "bigboiexternalapi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "bigboi327b1f0d": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "AppClientSecret": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "bigboibigboilambdalayer": {
      "Arn": "string"
    },
    "bigboiblogpoller": {
      "Arn": "string",
      "CloudWatchEventRule": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "bigboikinesisconsumer": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "bigboimessagestoring": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "bigboiurlmetadataresolver": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "bigboiutilitydiscordinteraction": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "bigboiwebhookproxy": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "hosting": {
    "S3AndCloudFront": {
      "CloudFrontDistributionID": "string",
      "CloudFrontDomainName": "string",
      "CloudFrontOriginAccessIdentity": "string",
      "CloudFrontSecureURL": "string",
      "HostingBucketName": "string",
      "Region": "string",
      "S3BucketSecureURL": "string",
      "WebsiteURL": "string"
    }
  },
  "storage": {
    "bigboicontent": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}