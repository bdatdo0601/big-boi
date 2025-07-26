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
        version: "0",
        id: "0c19aa24-7cb1-a83b-ac85-73783ea3ea19",
        "detail-type": "Event from aws:dynamodb",
        source: "Pipe public-content-stream-dev",
        account: "142037127835",
        time: "2025-07-26T03:53:12Z",
        region: "us-east-1",
        resources: [],
        detail: {
          source: "ddbstream",
          "detail-type": "public-realm-content",
          detail: {
            eventName: "INSERT",
            eventID: "2a643906c250aa77afb9a154d7b0f64d",
            eventVersion: "1.1",
            eventSource: "aws:dynamodb",
            awsRegion: "us-east-1",
            eventSourceARN:
              "arn:aws:dynamodb:us-east-1:142037127835:table/public-realm-content-dev/stream/2025-07-25T02:03:36.751",
            dynamodb: {
              ApproximateCreationDateTime: 1753501992,
              Keys: {
                sk: {
                  S: "World",
                },
                pk: {
                  S: "Hello",
                },
              },
              NewImage: {
                sk: {
                  S: "World",
                },
                pk: {
                  S: "Hello",
                },
              },
              SequenceNumber: "5032300000745759069447434",
              SizeBytes: 28,
              StreamViewType: "NEW_AND_OLD_IMAGES",
            },
            timestamp: "2025-07-26T03:53:12.222Z",
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
      expect(detail.metadata.tableName).toBe("public-realm-content-dev");
      expect(detail.data.action).toBe("INSERT");
    });

    it("should transform DDB MODIFY event correctly", async () => {
      const mockEvent: EventBridgeEvent<string, any> = {
        version: "0",
        id: "0c19aa24-7cb1-a83b-ac85-73783ea3ea19",
        "detail-type": "Event from aws:dynamodb",
        source: "Pipe public-content-stream-dev",
        account: "142037127835",
        time: "2025-07-26T03:53:12Z",
        region: "us-east-1",
        resources: [],
        detail: {
          source: "ddbstream",
          "detail-type": "public-realm-content",
          detail: {
            eventName: "MODIFY",
            eventID: "2a643906c250aa77afb9a154d7b0f64d",
            eventVersion: "1.1",
            eventSource: "aws:dynamodb",
            awsRegion: "us-east-1",
            eventSourceARN:
              "arn:aws:dynamodb:us-east-1:142037127835:table/public-realm-content-dev/stream/2025-07-25T02:03:36.751",
            dynamodb: {
              ApproximateCreationDateTime: 1753501992,
              Keys: {
                sk: {
                  S: "World",
                },
                pk: {
                  S: "Hello",
                },
              },
              OldImage: {
                sk: {
                  S: "World",
                },
                pk: {
                  S: "Hello",
                },
              },
              NewImage: {
                sk: {
                  S: "Hello",
                },
                pk: {
                  S: "World",
                },
              },
              SequenceNumber: "5032300000745759069447434",
              SizeBytes: 28,
              StreamViewType: "NEW_AND_OLD_IMAGES",
            },
            timestamp: "2025-07-26T03:53:12.222Z",
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

    it("should throw on unknown DDB event correctly", async () => {
      const mockEvent: EventBridgeEvent<string, any> = {
        version: "0",
        id: "0c19aa24-7cb1-a83b-ac85-73783ea3ea19",
        "detail-type": "Event from aws:dynamodb",
        source: "Pipe public-content-stream-dev",
        account: "142037127835",
        time: "2025-07-26T03:53:12Z",
        region: "us-east-1",
        resources: [],
        detail: {
          source: "ddbstream",
          "detail-type": "public-realm-content",
          detail: {
            eventName: "REMOVE",
            eventID: "2a643906c250aa77afb9a154d7b0f64d",
            eventVersion: "1.1",
            eventSource: "aws:dynamodb",
            awsRegion: "us-east-1",
            eventSourceARN:
              "arn:aws:dynamodb:us-east-1:142037127835:table/public-realm-content-dev/stream/2025-07-25T02:03:36.751",
            dynamodb: {
              ApproximateCreationDateTime: 1753501992,
              Keys: {
                sk: {
                  S: "World",
                },
                pk: {
                  S: "Hello",
                },
              },
              OldImage: {
                sk: {
                  S: "World",
                },
                pk: {
                  S: "Hello",
                },
              },
              SequenceNumber: "5032300000745759069447434",
              SizeBytes: 28,
              StreamViewType: "NEW_AND_OLD_IMAGES",
            },
            timestamp: "2025-07-26T03:53:12.222Z",
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
        version: "0",
        id: "0c19aa24-7cb1-a83b-ac85-73783ea3ea19",
        "detail-type": "Event from aws:dynamodb",
        source: "Pipe public-content-stream-dev",
        account: "142037127835",
        time: "2025-07-26T03:53:12Z",
        region: "us-east-1",
        resources: [],
        detail: {
          source: "ddbstream",
          "detail-type": "public-realm-content",
          detail: {
            eventName: "INSERT",
            eventID: "2a643906c250aa77afb9a154d7b0f64d",
            eventVersion: "1.1",
            eventSource: "aws:dynamodb",
            awsRegion: "us-east-1",
            eventSourceARN:
              "arn:aws:dynamodb:us-east-1:142037127835:table/public-realm-content-dev/stream/2025-07-25T02:03:36.751",
            dynamodb: {
              ApproximateCreationDateTime: 1753501992,
              Keys: {
                sk: {
                  S: "World",
                },
                pk: {
                  S: "Hello",
                },
              },
              NewImage: {
                sk: {
                  S: "World",
                },
                pk: {
                  S: "Hello",
                },
              },
              SequenceNumber: "5032300000745759069447434",
              SizeBytes: 28,
              StreamViewType: "NEW_AND_OLD_IMAGES",
            },
            timestamp: "2025-07-26T03:53:12.222Z",
          },
        },
      };

      await expect(handler(mockEvent, {} as any, {} as any)).rejects.toThrow(
        "EventBridge error",
      );
    });
  });
});
