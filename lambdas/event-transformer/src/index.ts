import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import {
  BigStructureEventInput,
  DDBPrefixToStructuredEventSource,
  DYNAMODB_EVENT_TYPE,
  RawDynamoDBEventSchema,
  RawEventSource,
  RawEventSourceIdentifierMap,
  RawS3EventSchema,
  S3BucketPrefixes,
  S3PrefixToStructuredEventSource,
} from "@big-boi-commons/typescript/lib";
import { EventBridgeEvent, Handler } from "aws-lambda";
import { v7 as uuid } from "uuid";

// Initialize EventBridge client
const eventbridge = new EventBridgeClient({});

const initializeStructuredEvent = (event: EventBridgeEvent<string, any>) => {
  return {
    id: uuid(),
    source: "EventTransformerLambda",
    detail: {
      eventMetadata: {
        transformAt: new Date().toISOString(),
        origin: event.source,
        originId: event.id,
        originDate: event.time,
        originDetailType: event["detail-type"],
      },
    },
  };
};

const transformFromDDBStreamEvent = async (
  event: EventBridgeEvent<string, any>,
): Promise<BigStructureEventInput> => {
  const ddbEvent = RawDynamoDBEventSchema.parse(event.detail);
  const streamARN = ddbEvent.eventSourceARN;
  const tableName = streamARN.split("/")[1];
  const metadata = {
    tableName: tableName || "unknown",
    keys: {
      pk: ddbEvent.dynamodb.Keys?.pk?.S || ddbEvent.dynamodb.Keys?.pk || "",
      sk: ddbEvent.dynamodb.Keys?.sk?.S || ddbEvent.dynamodb.Keys?.sk || "",
    },
    sequenceNumber: ddbEvent.dynamodb.SequenceNumber,
    sizeBytes: ddbEvent.dynamodb.SizeBytes,
    streamViewType: ddbEvent.dynamodb.StreamViewType,
  };

  const detailType = DDBPrefixToStructuredEventSource[event["detail-type"]];

  let data: any;
  switch (ddbEvent.eventName) {
    case DYNAMODB_EVENT_TYPE.INSERT:
      data = {
        action: DYNAMODB_EVENT_TYPE.INSERT,
        newImage: ddbEvent.dynamodb.NewImage,
      };
      break;
    case DYNAMODB_EVENT_TYPE.MODIFY:
      data = {
        action: DYNAMODB_EVENT_TYPE.MODIFY,
        oldImage: ddbEvent.dynamodb.OldImage,
        newImage: ddbEvent.dynamodb.NewImage,
      };
      break;
    case DYNAMODB_EVENT_TYPE.REMOVE:
      data = {
        action: DYNAMODB_EVENT_TYPE.REMOVE,
        oldImage: ddbEvent.dynamodb.OldImage,
      };
      break;
    default:
      throw new Error(`Unsupported DynamoDB event type: ${ddbEvent.eventName}`);
  }

  const structuredEvent = initializeStructuredEvent(event);
  return {
    ...structuredEvent,
    "detail-type": detailType,
    detail: {
      ...structuredEvent.detail,
      metadata,
      data,
    },
  };
};

const transformFromS3Event = async (
  event: EventBridgeEvent<string, any>,
): Promise<BigStructureEventInput> => {
  const s3Event = RawS3EventSchema.parse(event.detail);

  const metadata = {
    bucketName: s3Event.bucket.name,
    key: s3Event.object.key,
    size: s3Event.object.size,
    etag: s3Event.object.etag,
    versionId: s3Event.object["version-id"],
    sequencer: s3Event.object.sequencer,
    requestID: s3Event["request-id"],
    requester: s3Event.requester,
    sourceIPAddress: s3Event["source-ip-address"],
    reason: s3Event.reason,
  };

  const s3Prefix = Object.values(S3BucketPrefixes).find((item) =>
    metadata.bucketName.startsWith(item),
  ) as S3BucketPrefixes | undefined;

  if (!s3Prefix) {
    throw new Error(`Unsupported S3 bucket prefix ${metadata.bucketName}`);
  }

  const detailType = S3PrefixToStructuredEventSource[s3Prefix];

  const structuredEvent = initializeStructuredEvent(event);
  return {
    ...structuredEvent,
    "detail-type": detailType,
    detail: {
      ...structuredEvent.detail,
      metadata,
    },
  };
};

async function transformEvent(
  event: EventBridgeEvent<string, any>,
): Promise<BigStructureEventInput> {
  let rawEventSource: RawEventSource | null = null;
  for (const [sourceKey, schema] of Object.entries(
    RawEventSourceIdentifierMap,
  )) {
    const parseResult = schema.safeParse(event);
    if (parseResult.success) {
      rawEventSource = sourceKey as RawEventSource;
      break;
    }
  }
  switch (rawEventSource) {
    case RawEventSource.DDB_STREAM:
      return transformFromDDBStreamEvent(event);
    case RawEventSource.S3_EVENT_NOTIFICATION:
      return transformFromS3Event(event);
    default:
      throw new Error(`Unsupported event source: ${JSON.stringify(event)}`);
  }
}

export const handler: Handler<
  EventBridgeEvent<string, any>,
  BigStructureEventInput
> = async (event) => {
  const structuredBusName = process.env.STRUCTURED_BUS_NAME;

  if (!structuredBusName) {
    throw new Error("STRUCTURED_BUS_NAME environment variable is required");
  }
  try {
    const transformedEvent = await transformEvent(event);
    // Publish to structured event bus
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: transformedEvent.source,
          DetailType: transformedEvent["detail-type"],
          Detail: JSON.stringify(transformedEvent.detail),
          EventBusName: structuredBusName,
        },
      ],
    });

    const response = await eventbridge.send(command);

    console.info(
      `Successfully published structured event: ${JSON.stringify(response)}`,
    );
    return transformedEvent;
  } catch (error) {
    console.error("Failed to transform event:", error);
    throw error;
  }
};
