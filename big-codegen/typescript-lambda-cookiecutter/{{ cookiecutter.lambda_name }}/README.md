# {{ cookiecutter.lambda_name }} Lambda Function

{{ cookiecutter.lambda_description }}

## Overview

This Lambda function is built with TypeScript and uses rsbuild for efficient compilation and bundling. It includes AWS SDK v3 clients and follows the Big Boi project structure.

## Features

- **TypeScript**: Full type safety and modern JavaScript features
- **rsbuild**: Fast build tool with AWS Lambda plugin
- **AWS SDK v3**: Modular AWS services with tree-shaking
- **Error Handling**: Comprehensive error handling for both API Gateway and custom events
{% if cookiecutter.include_commons == 'y' %}
- **Commons Integration**: Uses @big-boi-commons/typescript for shared utilities
{% endif %}
- **Lodash**: Utility library for common operations

## Project Structure

```
{{ cookiecutter.lambda_name }}/
├── src/
│   └── index.ts          # Main Lambda handler
├── dist/                 # Compiled output (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── rsbuild.config.ts     # Build configuration
├── Makefile              # Build commands
└── README.md             # This file
```

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Building

```bash
# Build for deployment
npm run build

# Or use make
make package
```

### Development Mode

```bash
# Watch mode for development
npm run dev
```

## Usage

### Handler Function

The main handler function supports both API Gateway events and custom events:

```typescript
// API Gateway event
const apiGatewayEvent = {
  httpMethod: 'GET',
  path: '/hello',
  queryStringParameters: { name: 'world' }
  // ... other API Gateway properties
};

// Custom event
const customEvent = {
  message: 'Hello Lambda!',
  timestamp: new Date().toISOString()
};
```

### API Gateway Events

Supports standard HTTP methods:
- `GET`: Returns success with query parameters
- `POST`: Processes request body and returns confirmation
- Other methods return 405 Method Not Allowed

### Custom Events

For non-API Gateway events, the handler processes the event and returns a structured response:

```typescript
{
  success: boolean,
  data?: any,
  error?: string
}
```

## AWS SDK Usage

The template includes common AWS SDK v3 clients (commented out):

```typescript
// Uncomment and configure as needed
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
```

## Environment Variables

Configure these in your deployment:

- `AWS_REGION`: AWS region (usually set automatically)
- Add your custom environment variables here

## Deployment

This Lambda is designed to work with the Big Boi CDK infrastructure. Use the `TypeScriptLambda` construct in your CDK stack:

```typescript
import { TypeScriptLambda } from '../../common/constructs/ts-lambda';

const lambda = new TypeScriptLambda(this, '{{ cookiecutter.lambda_name | title }}Lambda', {
  functionName: '{{ cookiecutter.lambda_name }}',
  codePath: path.join(__dirname, '../../../lambdas/{{ cookiecutter.lambda_name }}'),
  timeout: Duration.seconds(30),
  memorySize: 256,
  environment: {
    // Your environment variables
  },
  description: '{{ cookiecutter.lambda_description }}',
});
```

## Customization

### Adding AWS Services

1. Install the specific AWS SDK client:
```bash
npm install @aws-sdk/client-[service-name]
```

2. Import and use in your handler:
```typescript
import { ServiceClient, CommandName } from '@aws-sdk/client-service-name';
```

### Event Types

Modify the `CustomEvent` interface to match your expected event structure:

```typescript
interface CustomEvent {
  // Define your event properties
  eventType: string;
  data: any;
  timestamp: string;
}
```

## Testing

Create test events and invoke your function locally or use AWS SAM for testing.

## Performance

- **Cold Start**: Optimized with rsbuild for minimal bundle size
- **Memory**: Default 256MB, adjust in CDK construct as needed  
- **Timeout**: Default 30 seconds, adjust in CDK construct as needed

## License

{{ cookiecutter.license }}

---

Generated with the Big Boi TypeScript Lambda cookiecutter template.
