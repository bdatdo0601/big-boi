import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { Context, EventBridgeEvent } from "aws-lambda";

// Initialize EventBridge client
const eventbridge = new EventBridgeClient({});

interface RawEventDetail {
  [key: string]: any;
}

interface StructuredEventMetadata {
  transformedAt: string;
  originalSource: string;
  originalDetailType: string;
  version: string;
  transformerId: string;
}

interface StructuredEventData {
  id: string;
  timestamp: string;
  type: string;
  userId?: string;
  customerId?: string;
  orderId?: string;
  payload: any;
}

interface StructuredEvent {
  metadata: StructuredEventMetadata;
  data: StructuredEventData;
}

interface LambdaResponse {
  statusCode: number;
  body: string;
}

export const handler = async (
  event: EventBridgeEvent<string, RawEventDetail>,
  context: Context,
): Promise<LambdaResponse> => {
  const structuredBusName = process.env.STRUCTURED_BUS_NAME;

  if (!structuredBusName) {
    throw new Error("STRUCTURED_BUS_NAME environment variable is required");
  }

  console.log(`Processing event: ${JSON.stringify(event)}`);

  try {
    // Extract the actual event data from EventBridge wrapper
    const rawEventData = event.detail;
    const source = event.source || "unknown";
    const detailType = event["detail-type"] || "Unknown Event";

    // Transform the event into structured format
    const structuredEvent = transformEvent(rawEventData, source, detailType);

    // Publish to structured event bus
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: "event.transformer",
          DetailType: "Structured Event",
          Detail: JSON.stringify(structuredEvent),
          EventBusName: structuredBusName,
        },
      ],
    });

    const response = await eventbridge.send(command);

    console.log(
      `Successfully published structured event: ${JSON.stringify(response)}`,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Event transformed and published successfully",
        eventId: response.Entries?.[0]?.EventId,
      }),
    };
  } catch (error) {
    console.error(`Error processing event: ${error}`);
    // Re-throw the exception to trigger DLQ
    throw error;
  }
};

function transformEvent(
  rawData: RawEventDetail,
  source: string,
  detailType: string,
): StructuredEvent {
  const currentTime = new Date().toISOString();

  // Basic structured event schema
  const structuredEvent: StructuredEvent = {
    metadata: {
      transformedAt: currentTime,
      originalSource: source,
      originalDetailType: detailType,
      version: "1.0",
      transformerId: "event-transformer-lambda",
    },
    data: {
      id: generateEventId(),
      timestamp: currentTime,
      type: "generic",
      payload: rawData,
    },
  };

  // Apply transformation rules based on event structure
  if (rawData && typeof rawData === "object") {
    // Extract and standardize the ID
    structuredEvent.data.id =
      extractValue(rawData, ["id", "event_id", "eventId"]) || generateEventId();

    // Extract and standardize timestamp
    const extractedTimestamp = extractValue(rawData, [
      "timestamp",
      "created_at",
      "createdAt",
      "time",
    ]);
    if (extractedTimestamp) {
      structuredEvent.data.timestamp = extractedTimestamp;
    }

    // Extract and standardize type
    const extractedType = extractValue(rawData, [
      "type",
      "event_type",
      "eventType",
      "category",
    ]);
    if (extractedType) {
      structuredEvent.data.type = extractedType;
    }

    // Extract and standardize user ID
    const userId = extractValue(rawData, [
      "user_id",
      "userId",
      "customer_id",
      "customerId",
    ]);
    if (userId) {
      structuredEvent.data.userId = userId;
    }

    // Extract and standardize customer ID
    const customerId = extractValue(rawData, ["customer_id", "customerId"]);
    if (customerId) {
      structuredEvent.data.customerId = customerId;
    }

    // Extract and standardize order ID
    const orderId = extractValue(rawData, ["order_id", "orderId"]);
    if (orderId) {
      structuredEvent.data.orderId = orderId;
    }
  }

  console.log(`Transformed event: ${JSON.stringify(structuredEvent)}`);
  return structuredEvent;
}

function extractValue(obj: any, keys: string[]): string | undefined {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return String(obj[key]);
    }
  }
  return undefined;
}

function generateEventId(): string {
  // Generate a UUID-like string
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
