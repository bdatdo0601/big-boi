import * as pipes from "@aws-cdk/aws-pipes-alpha";
import * as sources from "@aws-cdk/aws-pipes-sources-alpha";
import * as targets from "@aws-cdk/aws-pipes-targets-alpha";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";

export interface DynamoDBStreamToEventBridgePipesProps {
  /**
   * The DynamoDB table with a stream to use as the source
   */
  table: dynamodb.ITableV2;

  /**
   * The EventBridge bus to send events to
   */
  eventBus: events.IEventBus;

  /**
   * Name for the EventBridge Pipe
   */
  pipeName: string;

  /**
   * Optional description for the pipe
   */
  description?: string;

  /**
   * Optional environment name for resource naming
   */
  environment?: string;

  /**
   * Starting position for reading from the DynamoDB stream
   * @default DynamoDBStartingPosition.TRIM_HORIZON
   */
  startingPosition?: sources.DynamoDBStartingPosition;

  /**
   * The maximum number of records to include in each batch
   * @default 10
   */
  batchSize?: number;

  /**
   * The maximum amount of time to gather records before processing
   * @default Duration.seconds(0) - no batching window
   */
  maximumBatchingWindow?: cdk.Duration;

  /**
   * The number of batches to process from each shard concurrently
   * @default 1
   */
  parallelizationFactor?: number;

  /**
   * Input transformation for the events (optional)
   * This allows you to transform the DynamoDB stream records before sending to EventBridge
   */
  inputTransformation?: pipes.InputTransformation;

  /**
   * Filter to selectively process records (optional)
   */
  filter?: pipes.Filter;
}

/**
 * A construct that uses EventBridge Pipes to connect a DynamoDB stream to an EventBridge bus.
 *
 * This is a modern replacement for Lambda-based stream processors, offering:
 * - 🚀 Better performance and lower latency
 * - 💰 Lower cost (no Lambda cold starts or execution time charges)
 * - 🔧 Simpler configuration and maintenance
 * - 📊 Built-in monitoring and error handling
 * - 🎯 Native filtering and transformation capabilities
 *
 * Key Benefits over Lambda approach:
 * - No custom Lambda function code to maintain
 * - Automatic retry and dead letter queue handling
 * - Built-in parallelization and batching controls
 * - Native EventBridge integration with transformation
 * - Reduced operational overhead
 *
 * @example
 * ```typescript
 * const table = new dynamodb.TableV2(this, 'MyTable', {
 *   partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
 *   dynamoStream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
 * });
 *
 * const eventBus = new events.EventBus(this, 'MyEventBus');
 *
 * new DynamoDBStreamToEventBridgePipes(this, 'StreamToPipe', {
 *   table,
 *   eventBus,
 *   pipeName: 'my-table-stream-processor',
 *   description: 'Process MyTable stream events',
 *   batchSize: 100,
 *   maximumBatchingWindow: cdk.Duration.seconds(5),
 *   inputTransformation: pipes.InputTransformation.fromObject({
 *     source: 'myapp.dynamodb',
 *     'detail-type': 'DynamoDB Stream Record',
 *     detail: '<aws.pipes.event.dynamodb>',
 *   }),
 * });
 * ```
 */
export class DynamoDBStreamToEventBridgePipes extends Construct {
  /**
   * The EventBridge Pipe that connects the DynamoDB stream to EventBridge
   */
  public readonly pipe: pipes.Pipe;

  /**
   * The DynamoDB source used by the pipe
   */
  public readonly source: sources.DynamoDBSource;

  /**
   * The EventBridge target used by the pipe
   */
  public readonly target: targets.EventBridgeTarget;

  constructor(
    scope: Construct,
    id: string,
    props: DynamoDBStreamToEventBridgePipesProps,
  ) {
    super(scope, id);

    // Validate that the table has streams enabled
    if (!props.table.tableStreamArn) {
      throw new Error(
        `DynamoDB  must have streams enabled to use as a Pipes source. ` +
          `Set the 'dynamoStream' property when creating the table.`,
      );
    }

    // Create the DynamoDB source
    this.source = new sources.DynamoDBSource(props.table, {
      startingPosition:
        props.startingPosition ?? sources.DynamoDBStartingPosition.TRIM_HORIZON,
      batchSize: props.batchSize ?? 10,
      maximumBatchingWindow:
        props.maximumBatchingWindow ?? cdk.Duration.seconds(0),
      parallelizationFactor: props.parallelizationFactor ?? 1,
    });

    // Create the EventBridge target with input transformation
    this.target = new targets.EventBridgeTarget(
      props.eventBus,
      props.inputTransformation
        ? {
            inputTransformation: props.inputTransformation,
          }
        : undefined,
    );

    // Create the pipe
    this.pipe = new pipes.Pipe(this, "Pipe", {
      pipeName: props.pipeName,
      description:
        props.description || `EventBridge Pipe processing DynamoDB stream`,
      source: this.source,
      target: this.target,
      filter: props.filter,
    });

    // Output the pipe ARN and name
    new cdk.CfnOutput(this, "PipeArn", {
      value: this.pipe.pipeArn,
      description: `ARN of the EventBridge Pip`,
      exportName: `${props.pipeName}-arn-${props.environment || "dev"}`,
    });

    new cdk.CfnOutput(this, "PipeName", {
      value: this.pipe.pipeName,
      description: `Name of the EventBridge Pip`,
      exportName: `${props.pipeName}-name-${props.environment || "dev"}`,
    });

    // Add tags for better resource management
    cdk.Tags.of(this.pipe).add("Purpose", "DynamoDB-Stream-Processing");
    cdk.Tags.of(this.pipe).add(
      "SourceTable",
      props.table.tableName || "unknown",
    );
    cdk.Tags.of(this.pipe).add("TargetEventBus", props.eventBus.eventBusName);
    if (props.environment) {
      cdk.Tags.of(this.pipe).add("Environment", props.environment);
    }
  }

  /**
   * Creates an input transformation that formats DynamoDB stream records
   * into a standardized EventBridge event format.
   *
   * This is a convenience method that provides a commonly used transformation
   * for DynamoDB stream events.
   *
   * @param eventSource - The source identifier for the EventBridge events
   * @param eventDetailType - The detail type for the EventBridge events
   * @returns InputTransformation that can be used with the pipe
   */
  public static createStandardTransformation(
    eventSource: string,
    eventDetailType: string,
  ): pipes.InputTransformation {
    return pipes.InputTransformation.fromObject({
      source: eventSource,
      "detail-type": eventDetailType,
      detail: {
        eventName: "<$.eventName>",
        eventID: "<$.eventID>",
        eventVersion: "<$.eventVersion>",
        eventSource: "<$.eventSource>",
        awsRegion: "<$.awsRegion>",
        eventSourceARN: "<$.eventSourceARN>",
        dynamodb: "<$.dynamodb>",
        timestamp: "<aws.pipes.event.ingestion-time>",
      },
    });
  }

  /**
   * Creates a filter that only processes specific DynamoDB events
   *
   * @param eventNames - Array of event names to process (e.g., ['INSERT', 'MODIFY', 'REMOVE'])
   * @returns Filter that can be used with the pipe
   */
  public static createEventNameFilter(eventNames: string[]): pipes.Filter {
    return new pipes.Filter([
      pipes.FilterPattern.fromObject({
        eventName: eventNames,
      }),
    ]);
  }
}
