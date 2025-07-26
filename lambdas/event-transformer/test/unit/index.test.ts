import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import {
  DynamoDBTablePrefixes,
  RawEventSource,
} from "@big-boi-commons/typescript/lib";
import { EventBridgeEvent } from "aws-lambda";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Create mock functions
const mockSend = vi.fn();

// Mock the EventBridge client module before importing the handler
vi.mock("@aws-sdk/client-eventbridge", () => ({
  EventBridgeClient: vi.fn().mockImplementation(() => ({
    send: mockSend,
  })),
  PutEventsCommand: vi.fn().mockImplementation((params) => params),
}));

// Mock uuid
vi.mock("uuid", () => ({
  v7: vi.fn(() => "test-uuid-123"),
}));

// Mock the commons library
vi.mock("@big-boi-commons/typescript/lib", async () => {
  const actual = await vi.importActual("@big-boi-commons/typescript/lib");
  return {
    ...actual,
  };
});

// Import handler after mocks are set up
const { handler } = await import("../../src/index");

beforeEach(() => {
  vi.clearAllMocks();

  // Reset mock with default resolved value
  mockSend.mockResolvedValue({
    FailedEntryCount: 0,
    Entries: [{ EventId: "test-event-id" }],
  });

  process.env.STRUCTURED_BUS_NAME = "test-structured-bus";
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env.STRUCTURED_BUS_NAME;
});

describe("Event Transformer Lambda", () => {
  describe("DynamoDB Stream Events", () => {
    it("should transform DDB INSERT event correctly", async () => {
      const mockEvent: EventBridgeEvent<string, any> = {
        id: "original-event-id",
        source: RawEventSource.DDB_STREAM,
        "detail-type": DynamoDBTablePrefixes.PRIVATE_CONTENT,
        time: "2023-01-01T00:00:00Z",
        region: "us-east-1",
        account: "123456789012",
        version: "0",
        resources: [],
        detail: {
          eventID: "test-event-id",
          eventName: "INSERT",
          eventVersion: "1.1",
          eventSource: "aws:dynamodb",
          awsRegion: "us-east-1",
          eventSourceARN:
            "arn:aws:dynamodb:us-east-1:123456789012:table/TestTable/stream/123",
          dynamodb: {
            Keys: {
              pk: { S: "test-pk" },
              sk: { S: "test-sk" },
            },
            NewImage: {
              pk: { S: "test-pk" },
              sk: { S: "test-sk" },
              data: { S: "test-data" },
            },
            SequenceNumber: "123456789",
            SizeBytes: 100,
            StreamViewType: "NEW_AND_OLD_IMAGES",
          },
        },
      };

      const result = await handler(mockEvent, {} as any, {} as any);

      expect(mockSend).toHaveBeenCalledTimes(1);
      const { PutEventsCommand } = await import("@aws-sdk/client-eventbridge");
      expect(PutEventsCommand).toHaveBeenCalledWith({
        Entries: [
          {
            Source: "EventTransformerLambda",
            DetailType: expect.any(String),
            Detail: expect.any(String),
            EventBusName: "test-structured-bus",
          },
        ],
      });

      if (!result) {
        throw new Error("Result is undefined");
      }

      expect(result.id).toBe("test-uuid-123");
      expect(result.source).toBe("EventTransformerLambda");
      const detail: any = result.detail;
      expect(detail.eventMetadata.origin).toBe(RawEventSource.DDB_STREAM);
      expect(detail.metadata.tableName).toBe("TestTable");
      expect(detail.data.action).toBe("INSERT");
    });

    it("should transform DDB MODIFY event correctly", async () => {
      const mockEvent: EventBridgeEvent<string, any> = {
        id: "original-event-id",
        source: RawEventSource.DDB_STREAM,
        "detail-type": DynamoDBTablePrefixes.PUBLIC_CONTENT,
        time: "2023-01-01T00:00:00Z",
        region: "us-east-1",
        account: "123456789012",
        version: "0",
        resources: [],
        detail: {
          eventID: "test-event-id",
          eventName: "MODIFY",
          eventVersion: "1.1",
          eventSource: "aws:dynamodb",
          awsRegion: "us-east-1",
          eventSourceARN:
            "arn:aws:dynamodb:us-east-1:123456789012:table/TestTable/stream/123",
          dynamodb: {
            Keys: {
              pk: { S: "test-pk" },
              sk: { S: "test-sk" },
            },
            OldImage: {
              pk: { S: "test-pk" },
              sk: { S: "test-sk" },
              data: { S: "old-data" },
            },
            NewImage: {
              pk: { S: "test-pk" },
              sk: { S: "test-sk" },
              data: { S: "new-data" },
            },
            SequenceNumber: "123456789",
            SizeBytes: 100,
            StreamViewType: "NEW_AND_OLD_IMAGES",
          },
        },
      };

      const result = await handler(mockEvent, {} as any, {} as any);
      if (!result) {
        throw new Error("Result is undefined");
      }
      const detail: any = result.detail;
      expect(detail.data.action).toBe("MODIFY");
      expect(detail.data.oldImage).toBeDefined();
      expect(detail.data.newImage).toBeDefined();
    });

    it("should transform DDB REMOVE event correctly", async () => {
      const mockEvent: EventBridgeEvent<string, any> = {
        id: "original-event-id",
        source: RawEventSource.DDB_STREAM,
        "detail-type": DynamoDBTablePrefixes.PRIVATE_CONTENT,
        time: "2023-01-01T00:00:00Z",
        region: "us-east-1",
        account: "123456789012",
        version: "0",
        resources: [],
        detail: {
          eventID: "test-event-id",
          eventName: "REMOVE",
          eventVersion: "1.1",
          eventSource: "aws:dynamodb",
          awsRegion: "us-east-1",
          eventSourceARN:
            "arn:aws:dynamodb:us-east-1:123456789012:table/TestTable/stream/123",
          dynamodb: {
            Keys: {
              pk: { S: "test-pk" },
              sk: { S: "test-sk" },
            },
            OldImage: {
              pk: { S: "test-pk" },
              sk: { S: "test-sk" },
              data: { S: "old-data" },
            },
            SequenceNumber: "123456789",
            SizeBytes: 100,
            StreamViewType: "NEW_AND_OLD_IMAGES",
          },
        },
      };

      const result = await handler(mockEvent, {} as any, {} as any);
      if (!result) {
        throw new Error("Result is undefined");
      }
      const detail: any = result.detail;
      expect(detail.data.action).toBe("REMOVE");
      expect(detail.data.oldImage).toBeDefined();
      expect(detail.data.newImage).toBeUndefined();
    });
  });

  describe("S3 Events", () => {
    it("should transform S3 event correctly", async () => {
      const mockEvent: EventBridgeEvent<string, any> = {
        id: "original-event-id",
        source: "aws.s3",
        "detail-type": "Object Created",
        time: "2023-01-01T00:00:00Z",
        region: "us-east-1",
        account: "123456789012",
        version: "0",
        resources: [],
        detail: {
          version: "0",
          bucket: {
            name: "public-realm-storage-dev",
          },
          object: {
            key: "test-object-key",
            size: 1024,
            etag: "test-etag",
            "version-id": "test-version-id",
            sequencer: "test-sequencer",
          },
          "request-id": "test-request-id",
          requester: "test-requester",
          "source-ip-address": "192.168.1.1",
          reason: "PutObject",
        },
      };

      const result = await handler(mockEvent, {} as any, {} as any);

      if (!result) {
        throw new Error("Result is undefined");
      }
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result.id).toBe("test-uuid-123");
      expect(result.source).toBe("EventTransformerLambda");
      const detail: any = result.detail;
      expect(detail.eventMetadata.origin).toBe("aws.s3");
      expect(detail.metadata.bucketName).toBe("public-realm-storage-dev");
      expect(detail.metadata.key).toBe("test-object-key");
    });
  });

  describe("Error Handling", () => {
    it("should throw error when STRUCTURED_BUS_NAME is not set", async () => {
      delete process.env.STRUCTURED_BUS_NAME;

      const mockEvent: EventBridgeEvent<string, any> = {
        id: "test-id",
        source: "test-source",
        "detail-type": "test-detail-type",
        time: "2023-01-01T00:00:00Z",
        region: "us-east-1",
        account: "123456789012",
        version: "0",
        resources: [],
        detail: {},
      };

      await expect(handler(mockEvent, {} as any, {} as any)).rejects.toThrow(
        "STRUCTURED_BUS_NAME environment variable is required",
      );
    });

    it("should throw error for unsupported event source", async () => {
      const mockEvent: EventBridgeEvent<string, any> = {
        id: "test-id",
        source: "unsupported.source",
        "detail-type": "unsupported-type",
        time: "2023-01-01T00:00:00Z",
        region: "us-east-1",
        account: "123456789012",
        version: "0",
        resources: [],
        detail: {},
      };

      await expect(handler(mockEvent, {} as any, {} as any)).rejects.toThrow(
        /Unsupported event source/,
      );
    });

    it("should handle EventBridge publish failure", async () => {
      // Setup a failing mock for this specific test
      mockSend.mockRejectedValueOnce(new Error("EventBridge error"));

      const mockEvent: EventBridgeEvent<string, any> = {
        id: "original-event-id",
        source: RawEventSource.DDB_STREAM,
        "detail-type": DynamoDBTablePrefixes.PRIVATE_CONTENT,
        time: "2023-01-01T00:00:00Z",
        region: "us-east-1",
        account: "123456789012",
        version: "0",
        resources: [],
        detail: {
          eventID: "test-event-id",
          eventName: "INSERT",
          eventVersion: "1.1",
          eventSource: "aws:dynamodb",
          awsRegion: "us-east-1",
          eventSourceARN:
            "arn:aws:dynamodb:us-east-1:123456789012:table/TestTable/stream/123",
          dynamodb: {
            Keys: { pk: { S: "test-pk" }, sk: { S: "test-sk" } },
            NewImage: { pk: { S: "test-pk" }, sk: { S: "test-sk" } },
            SequenceNumber: "123456789",
            SizeBytes: 100,
            StreamViewType: "NEW_AND_OLD_IMAGES",
          },
        },
      };

      await expect(handler(mockEvent, {} as any, {} as any)).rejects.toThrow(
        "EventBridge error",
      );
    });
  });
});
