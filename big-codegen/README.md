# Templates

This directory contains cookiecutter templates for generating standardized components in the Big Boi project.

## TypeScript Lambda Generator

A simple shell script for generating TypeScript Lambda functions with rsbuild and AWS SDK v3.

### Quick Usage

```bash
# Basic lambda
./templates/generate-lambda.sh --name user-service

# With description
./templates/generate-lambda.sh --name payment-api --desc "Payment processing API"

# Without commons library
./templates/generate-lambda.sh --name simple-lambda
```

### Prerequisites

- **cookiecutter**: Auto-installed via `uv` if missing
- **uv**: Modern Python package manager
- **Node.js 18+**: For building generated Lambdas

### Usage

**Generate a Lambda:**
```bash
./templates/generate-lambda.sh --name my-service
./templates/generate-lambda.sh --name payment-api --desc "Payment processing API"
./templates/generate-lambda.sh --name simple-lambda
```

**Build the Lambda:**
```bash
cd lambdas/my-service
npm install && npm run build
```

## Generated Lambda Features

Each generated Lambda includes:
- **TypeScript**: Full type safety with AWS Lambda types
- **rsbuild**: Fast build tool optimized for AWS Lambda
- **AWS SDK v3**: Pre-configured with common services
- **Error Handling**: Built-in patterns for API Gateway and custom events
- **Big Boi Commons**: Optional shared utilities integration

## CDK Integration

Use with existing TypeScript Lambda construct:

```typescript
const lambda = new TypeScriptLambda(this, 'MyLambda', {
  functionName: 'my-service',
  codePath: path.join(__dirname, '../../../lambdas/my-service'),
  // ... other options
});
```

## Command Reference

```bash
./templates/generate-lambda.sh --name NAME [--desc DESCRIPTION]
```

- `--name`: Lambda function name (required)
- `--desc`: Description (optional, defaults to "A TypeScript Lambda function")
- `--help`: Show usage help
