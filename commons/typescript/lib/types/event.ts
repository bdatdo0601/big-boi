import { z } from "zod";
import {
  DYNAMODB_EVENT_TYPE,
  DynamoDBTablePrefixes,
  S3BucketPrefixes,
  StructuredEventSource,
} from "../enums";

const BaseDetailSchema = z.object({
  eventMetadata: z.object({
    transformAt: z.string(),
    originDate: z.string(),
    origin: z.string(),
    originId: z.string(),
    originDetailType: z.string(),
  }),
});

const BaseStructuredEventSchema = z.object({
  version: z.string(),
  id: z.uuid(),
  source: z.string(),
  time: z.string(),
  region: z.string(),
  resources: z.array(z.string()),
});

export const DynamoDBDetailSchema = BaseDetailSchema.extend({
  metadata: {
    tableName: z.string(),
    keys: z.object({
      pk: z.string(),
      sk: z.string(),
    }),
    sequenceNumber: z.string().optional(),
    sizeBytes: z.number().min(0).optional(),
    streamViewType: z.string().optional(),
  },
  data: z.discriminatedUnion("action", [
    z.object({
      action: z.literal(DYNAMODB_EVENT_TYPE.INSERT),
      newImage: z.any(),
    }),
    z.object({
      action: z.literal(DYNAMODB_EVENT_TYPE.MODIFY),
      oldImage: z.any(),
      newImage: z.any(),
    }),
    z.object({
      action: z.literal(DYNAMODB_EVENT_TYPE.REMOVE),
      oldImage: z.any(),
    }),
  ]),
});

export const DDBPrefixToStructuredEventSource: Record<
  string,
  | StructuredEventSource.SYSTEM_PRIVATE_CONTENT
  | StructuredEventSource.SYSTEM_PUBLIC_CONTENT
> = {
  [DynamoDBTablePrefixes.PRIVATE_CONTENT]:
    StructuredEventSource.SYSTEM_PRIVATE_CONTENT,
  [DynamoDBTablePrefixes.PUBLIC_CONTENT]:
    StructuredEventSource.SYSTEM_PUBLIC_CONTENT,
};

export const S3PrefixToStructuredEventSource: Record<
  string,
  | StructuredEventSource.SYSTEM_PRIVATE_OBJECT
  | StructuredEventSource.SYSTEM_PUBLIC_OBJECT
> = {
  [S3BucketPrefixes.PRIVATE_OBJECT]:
    StructuredEventSource.SYSTEM_PRIVATE_OBJECT,
  [S3BucketPrefixes.PUBLIC_OBJECT]: StructuredEventSource.SYSTEM_PUBLIC_OBJECT,
};

const S3DetailSchema = BaseDetailSchema.extend({
  metadata: z.object({
    bucketName: z.string(),
    key: z.string(),
    size: z.number(),
    etag: z.string(),
    versionId: z.string(),
    sequencer: z.string(),
    requestID: z.string(),
    requester: z.string(),
    sourceIPAddress: z.string(),
    reason: z.string(),
  }),
});

export const BigStructuredEventSchema = z.discriminatedUnion("detail-type", [
  BaseStructuredEventSchema.extend({
    "detail-type": z.literal(StructuredEventSource.SYSTEM_PRIVATE_CONTENT),
    detail: DynamoDBDetailSchema,
  }),
  BaseStructuredEventSchema.extend({
    "detail-type": z.literal(StructuredEventSource.SYSTEM_PUBLIC_CONTENT),
    detail: DynamoDBDetailSchema,
  }),
  BaseStructuredEventSchema.extend({
    "detail-type": z.literal(StructuredEventSource.SYSTEM_PRIVATE_OBJECT),
    detail: S3DetailSchema,
  }),
  BaseStructuredEventSchema.extend({
    "detail-type": z.literal(StructuredEventSource.SYSTEM_PUBLIC_OBJECT),
    detail: S3DetailSchema,
  }),
]);

export type BigStructureEvent = z.infer<typeof BigStructuredEventSchema>;
export type BigStructureEventInput = Partial<BigStructureEvent> &
  Pick<BigStructureEvent, "detail-type" | "source" | "detail">;
