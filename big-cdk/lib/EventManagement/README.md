# Event Management Stack

This CDK stack sets up a complete event-driven architecture with event transformation capabilities, implemented in TypeScript.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────────┐    ┌──────────────────────┐
│   Raw Events    │───▶│  Event Transformer  │───▶│  Structured Events   │
│   (BigRawBus)   │    │  Lambda (TypeScript)│    │ (BigStructuredBus)   │
└─────────────────┘    └─────────────────────┘    └──────────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  DLQ for Failed │
                       │  Transformations│
                       └─────────────────┘
```

## Components

### 1. Event Buses

- **BigRawBus**: Receives raw events from various sources
- **BigStructuredBus**: Contains transformed, standardized events

Both buses include:
- Schema discovery and registry
- CloudWatch logging for all events
- Appropriate IAM policies

### 2. Event Transformer Lambda (TypeScript)

A Node.js 22.x Lambda function written in TypeScript that:
- Listens to ALL events on the BigRawBus
- Transforms events into a standardized structure
- Publishes transformed events to BigStructuredBus
- Handles errors gracefully with retry logic
- Uses the AWS SDK v3 for EventBridge operations

**Location**: `big-boi/lambdas/event-transformer/`

**Transformation Logic:**
- Standardizes common fields (id, timestamp, userId, customerId, orderId)
- Adds metadata about the transformation
- Maintains original event data in payload
- Generates unique IDs for events without them
- Uses proper TypeScript typing for better reliability

### 3. Dead Letter Queue (DLQ)

SQS queue that captures:
- Events that fail transformation after retries
- Lambda function failures
- EventBridge delivery failures

### 4. Monitoring & Observability

Built-in CloudWatch alarms for:
- Lambda errors (>5 errors in 10 minutes)
- Lambda throttling
- Messages in DLQ
- All events are logged to CloudWatch

## Event Structure

### Raw Event (Input)
Any valid JSON event structure, for example:
```json
{
  "order_id": "order_123",
  "customer_id": "cust_456",
  "total": 99.99,
  "items": [...]
}
```

### Structured Event (Output)
Standardized format:
```json
{
  "metadata": {
    "transformedAt": "2024-07-24T16:22:51Z",
    "originalSource": "ecommerce.orders",
    "originalDetailType": "Order Created",
    "version": "1.0",
    "transformerId": "event-transformer-lambda"
  },
  "data": {
    "id": "generated-or-extracted-id",
    "timestamp": "2024-07-24T16:22:51Z",
    "type": "order",
    "userId": "cust_456",
    "orderId": "order_123",
    "payload": {
      // Original event data
    }
  }
}
```

## Development

### Lambda Function Development

The Lambda function is located in `big-boi/lambdas/event-transformer/`:

```bash
cd big-boi/lambdas/event-transformer
npm install
npm run build  # Compiles TypeScript to JavaScript
```

### Lambda Structure
- `src/index.ts` - Main Lambda handler with proper TypeScript types
- `package.json` - Dependencies including AWS SDK v3
- `tsconfig.json` - TypeScript configuration
- `dist/` - Compiled JavaScript (auto-generated)

### CDK Usage

The construct uses the `TypeScriptLambda` helper which:
- Expects compiled TypeScript in the `dist/` folder
- Uses Node.js 22.x runtime
- Handles proper asset bundling for CDK

## Usage

### Publishing to Raw Bus

```bash
aws events put-events \
  --entries '[{
    "Source": "my.application",
    "DetailType": "Test Event", 
    "Detail": "{\"test\": \"data\"}",
    "EventBusName": "BigRawBus"
  }]'
```

### Testing

Use the provided TypeScript test script:

```bash
cd big-boi/lambdas/event-transformer
npx ts-node test-events.ts
```

This will publish sample events of different types to test the transformation pipeline.

### Monitoring

Check CloudWatch:
- **Logs**: Look for `/aws/lambda/event-transformer` and event bus log groups
- **Alarms**: Monitor the created alarms for system health
- **Metrics**: Lambda invocations, errors, duration

### Handling Failed Events

1. Check the DLQ: `event-transformer-dlq`
2. Review CloudWatch logs for error details
3. Fix issues and replay events if needed

## Stack Outputs

After deployment, the following are available:
- `BigRawBusArn`: ARN of the raw event bus
- `BigStructuredBusArn`: ARN of the structured event bus  
- `EventTransformerFunctionArn`: ARN of the transformer Lambda
- `EventTransformerDLQArn`: ARN of the dead letter queue
- `EventTransformerRuleArn`: ARN of the event rule

## Customization

### Modifying Transformation Logic

Edit `big-boi/lambdas/event-transformer/src/index.ts` to add custom transformation rules:

```typescript
function transformEvent(
  rawData: RawEventDetail,
  source: string,
  detailType: string
): StructuredEvent {
  // Add your custom transformation logic here
  // Full TypeScript support available
}
```

After making changes:
```bash
cd big-boi/lambdas/event-transformer
npm run build
```

Then redeploy your CDK stack.

### Adding Event Patterns

To filter specific events instead of processing all events, modify the event rule pattern in `constructs/event-transformer.ts`:

```typescript
eventPattern: {
  source: ["specific.source"],
  detailType: ["Specific Event Type"]
}
```

## Benefits of TypeScript Implementation

- **Type Safety**: Compile-time checking prevents runtime errors
- **Better IDE Support**: IntelliSense, refactoring, and debugging
- **AWS SDK v3**: Modern, tree-shakeable, and more efficient
- **Maintainability**: Easier to understand and modify
- **Error Prevention**: Catches common mistakes before deployment

## Cost Optimization

- Lambda uses Node.js 22.x runtime (efficient and fast)
- TypeScript compilation happens at build time, not runtime
- SQS DLQ retention is 14 days
- CloudWatch logs retention is 1 week (configurable)
- Consider using EventBridge filtering to reduce Lambda invocations for high-volume scenarios
