/**
 * Raw event bridge schema type is used to identify what type of event is being processed.
 *
 * For any categorization of sub event, we will handle it during transformation
 */
import { z } from "zod";
import {
  DYNAMODB_EVENT_TYPE,
  DynamoDBTablePrefixes,
  RawEventSource,
  S3_EVENT_TYPE,
} from "../enums";

export const RawDynamoDBEventSchema = z.object({
  eventID: z.string(),
  eventName: z.enum(DYNAMODB_EVENT_TYPE),
  eventVersion: z.string(),
  eventSource: z.string(),
  eventSourceARN: z.string(),
  awsRegion: z.string(),
  dynamodb: z.object({
    Keys: z.any().optional(),
    NewImage: z.any().optional(),
    OldImage: z.any().optional(),
    SequenceNumber: z.string().optional(),
    SizeBytes: z.number().optional(),
    StreamViewType: z.string().optional(),
  }),
});

export const RawS3EventSchema = z.object({
  version: z.string(),
  bucket: z.object({
    name: z.string(),
  }),
  object: z.object({
    key: z.string(),
    size: z.number().optional(),
    etag: z.string(),
    "version-id": z.string(),
    sequencer: z.string(),
  }),
  "request-id": z.string(),
  requester: z.string(),
  "source-ip-address": z.string(),
  reason: z.string(),
});

export const RawEventSourceIdentifierMap: {
  [key in RawEventSource]: z.ZodObject;
} = {
  [RawEventSource.DDB_STREAM]: z.looseObject({
    "detail-type": z.literal("Event from aws:dynamodb"),
  }),
  [RawEventSource.S3_EVENT_NOTIFICATION]: z.looseObject({
    source: z.literal(RawEventSource.S3_EVENT_NOTIFICATION),
    "detail-type": z.enum(S3_EVENT_TYPE),
  }),
};

export type RawDynamoDBEvent = z.infer<typeof RawDynamoDBEventSchema>;
export type RawS3Event = z.infer<typeof RawS3EventSchema>;
