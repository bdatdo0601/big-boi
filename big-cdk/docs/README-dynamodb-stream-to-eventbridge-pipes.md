# DynamoDB Stream to EventBridge using EventBridge Pipes

A modern CDK construct that connects DynamoDB streams to EventBridge using EventBridge Pipes instead of Lambda functions.

## Overview

The `DynamoDBStreamToEventBridgePipes` construct provides a high-performance, low-cost alternative to Lambda-based stream processing. It uses EventBridge Pipes to directly connect DynamoDB streams to EventBridge, eliminating the need for custom Lambda function code.

## Key Benefits

### 🚀 **Performance & Reliability**
- **No cold starts**: Pipes are serverless with no initialization delay
- **Lower latency**: Direct integration without Lambda runtime overhead  
- **Better throughput**: Native streaming capabilities with built-in parallelization
- **Consistent performance**: No variability from Lambda execution environment

### 💰 **Cost Optimization**
- **Reduced costs**: No Lambda execution time charges
- **Pay-per-event**: Only pay for events processed, not execution duration
- **No compute costs**: No underlying compute infrastructure to manage

### 🔧 **Operational Excellence**  
- **Zero maintenance**: No custom Lambda code to maintain or update
- **Built-in monitoring**: Native CloudWatch integration for metrics and logging
- **Automatic scaling**: Handles traffic spikes without configuration
- **Simplified architecture**: Fewer moving parts reduce operational complexity

### 📊 **Enhanced Features**
- **Native filtering**: Filter events before processing without custom code
- **Built-in transformations**: Transform data structure without Lambda functions
- **Dead letter handling**: Automatic retry and failure handling
- **Advanced batching**: Configurable batch sizes and windowing

## Installation

```bash
npm install @aws-cdk/aws-pipes-alpha @aws-cdk/aws-pipes-sources-alpha @aws-cdk/aws-pipes-targets-alpha
```

## Quick Start

```typescript
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import { DynamoDBStreamToEventBridgePipes } from "./constructs/dynamodb-stream-to-eventbridge-pipes";

// Create a DynamoDB table with streams enabled
const table = new dynamodb.TableV2(this, "MyTable", {
  partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
  dynamoStream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES, // Required!
});

// Create an EventBridge bus
const eventBus = new events.EventBus(this, "MyEventBus");

// Connect them with a pipe
new DynamoDBStreamToEventBridgePipes(this, "StreamPipe", {
  table,
  eventBus,
  pipeName: "my-table-processor",
  inputTransformation: DynamoDBStreamToEventBridgePipes.createStandardTransformation(
    "myapp.dynamodb",
    "Table Record Changed"
  ),
});
```

## Configuration Options

### Basic Configuration

```typescript
new DynamoDBStreamToEventBridgePipes(this, "BasicPipe", {
  table: myTable,
  eventBus: myEventBus,
  pipeName: "basic-processor",
  description: "Process table changes",
  environment: "production",
});
```

### Performance Tuning

```typescript
new DynamoDBStreamToEventBridgePipes(this, "HighThroughputPipe", {
  table: myTable,
  eventBus: myEventBus,  
  pipeName: "high-throughput-processor",
  
  // Batch configuration for high throughput
  batchSize: 100,                                    // Process up to 100 records per batch
  maximumBatchingWindow: cdk.Duration.seconds(2),    // Wait max 2 seconds before processing
  parallelizationFactor: 5,                          // Process 5 batches per shard concurrently
  startingPosition: sources.DynamoDBStartingPosition.TRIM_HORIZON,
});
```

### Event Filtering

```typescript
new DynamoDBStreamToEventBridgePipes(this, "FilteredPipe", {
  table: myTable,
  eventBus: myEventBus,
  pipeName: "filtered-processor",
  
  // Only process INSERT and MODIFY events (ignore REMOVE)
  filter: DynamoDBStreamToEventBridgePipes.createEventNameFilter([
    "INSERT",
    "MODIFY"
  ]),
});
```

### Custom Event Transformation

```typescript
new DynamoDBStreamToEventBridgePipes(this, "CustomPipe", {
  table: myTable,
  eventBus: myEventBus,
  pipeName: "custom-processor",
  
  // Custom transformation that extracts specific fields
  inputTransformation: pipes.InputTransformation.fromObject({
    source: "myapp.users",
    "detail-type": "User Profile Changed",
    detail: {
      userId: "<aws.pipes.event.dynamodb.dynamodb.Keys.userId.S>",
      changeType: "<aws.pipes.event.dynamodb.eventName>",
      email: "<aws.pipes.event.dynamodb.dynamodb.NewImage.email.S>",
      timestamp: "<aws.pipes.event.ingestion-time>",
    },
  }),
});
```

## API Reference

### Constructor Props

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `table` | `ITableV2` | DynamoDB table with streams enabled | Required |
| `eventBus` | `IEventBus` | EventBridge bus to send events to | Required |
| `pipeName` | `string` | Name for the pipe | Required |
| `description` | `string` | Description for the pipe | Auto-generated |
| `environment` | `string` | Environment name for resource tagging | `"dev"` |
| `startingPosition` | `DynamoDBStartingPosition` | Where to start reading from stream | `TRIM_HORIZON` |
| `batchSize` | `number` | Max records per batch | `10` |
| `maximumBatchingWindow` | `Duration` | Max time to wait for batch | `0` (no waiting) |
| `parallelizationFactor` | `number` | Concurrent batches per shard | `1` |
| `inputTransformation` | `InputTransformation` | Transform events before sending | None |
| `filter` | `Filter` | Filter events before processing | None |

### Static Methods

#### `createStandardTransformation(eventSource: string, eventDetailType: string)`

Creates a standard transformation that formats DynamoDB stream records into EventBridge events with the structure:

```json
{
  "source": "your-event-source",
  "detail-type": "Your Detail Type",
  "detail": {
    "eventName": "INSERT|MODIFY|REMOVE",
    "eventID": "unique-event-id",
    "dynamodb": { /* full DynamoDB record */ },
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### `createEventNameFilter(eventNames: string[])`

Creates a filter that only processes specified DynamoDB event types:

```typescript
// Only process INSERT and MODIFY events
const filter = DynamoDBStreamToEventBridgePipes.createEventNameFilter([
  "INSERT", 
  "MODIFY"
]);
```

### Properties

- `pipe: pipes.Pipe` - The underlying EventBridge Pipe
- `source: sources.DynamoDBSource` - The DynamoDB source configuration  
- `target: targets.EventBridgeTarget` - The EventBridge target configuration

## Monitoring

EventBridge Pipes provide built-in CloudWatch metrics that you can monitor:

- `AWS/Pipes` namespace metrics
- `PipeArn` dimension for specific pipe metrics
- Success/failure counts, processing latency, etc.

You can access these through the AWS console or create custom CloudWatch dashboards and alarms.

## Migration from Lambda-based Processing

If you're migrating from a Lambda-based stream processor, see our [Migration Guide](../docs/dynamodb-stream-migration-guide.md) for step-by-step instructions and considerations.

## Examples

See [examples/dynamodb-stream-pipes-example.ts](../examples/dynamodb-stream-pipes-example.ts) for complete working examples including:

- Basic usage
- High-throughput configuration  
- Custom transformations
- Event filtering
- Monitoring setup

## Prerequisites

- DynamoDB table must have streams enabled (`dynamoStream` property)
- EventBridge Pipes alpha packages must be installed
- CDK v2.193.0 or higher

## Troubleshooting

### Common Issues

1. **"Table must have streams enabled"** - Ensure your DynamoDB table has `dynamoStream` set
2. **TypeScript compilation errors** - Ensure alpha packages are installed with matching versions
3. **Events not appearing** - Check that stream is enabled and pipe is in RUNNING state

### Debugging

1. Check CloudWatch Logs for the pipe execution logs
2. Monitor CloudWatch Metrics under the `AWS/Pipes` namespace  
3. Use EventBridge test events to verify event format
4. Check IAM permissions if events aren't reaching targets

## License

This construct is provided under the same license as your project.
