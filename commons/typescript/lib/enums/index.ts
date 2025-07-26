export const OWNER_ACTOR = "superuser_system";
export const DB_DELIMITER = "#||@";

export enum TextContentType {
  TEXT = "text",
  HTML = "html",
  MARKDOWN = "markdown",
  JSON = "json",
}

export enum LLMSecretKey {
  MISTRAL = "MISTRAL_API_KEY",
  ANTHROPIC = "ANTHROPIC_API_KEY",
}

/**
 * Always dot notation
 */
export enum StructuredEventSource {
  SYSTEM_PRIVATE_CONTENT = `${OWNER_ACTOR}.private.content`,
  SYSTEM_PRIVATE_OBJECT = `${OWNER_ACTOR}.private.object`,
  SYSTEM_PUBLIC_CONTENT = `${OWNER_ACTOR}.public.content`,
  SYSTEM_PUBLIC_OBJECT = `${OWNER_ACTOR}.public.object`,
}

export enum DYNAMODB_EVENT_TYPE {
  INSERT = "INSERT",
  MODIFY = "MODIFY",
  REMOVE = "REMOVE",
}

export enum S3_EVENT_TYPE {
  OBJECT_CREATED = "Object Created",
  OBJECT_DELETED = "Object Deleted",
  OBJECT_RESTORE_INITIATED = "Object Restore Initiated",
  OBJECT_RESTORE_COMPLETED = "Object Restore Completed",
  OBJECT_RESTORE_EXPIRED = "Object Restore Expired",
  OBJECT_TAGS_ADDED = "Object Tags Added",
  OBJECT_TAGS_DELETED = "Object Tags Deleted",
  OBJECT_ACL_UPDATED = "Object ACL Updated",
  OBJECT_STORAGE_CLASS_CHANGED = "Object Storage Class Changed",
  OBJECT_ACCESS_TIER_CHANGED = "Object Access Tier Changed",
}

export enum RawEventSource {
  DDB_STREAM = "ddbstream",
  S3_EVENT_NOTIFICATION = "aws.s3",
}

export enum S3BucketPrefixes {
  PRIVATE_OBJECT = "private-realm-storage",
  PUBLIC_OBJECT = "public-realm-storage",
}

export enum DynamoDBTablePrefixes {
  PRIVATE_CONTENT = "private-realm-content",
  PUBLIC_CONTENT = "public-realm-content",
  PRIVATE_EVENT = "private-realm-events",
  PUBLIC_EVENT = "public-realm-events",
  PRIVATE_FLEXSEARCH = "private-realm-flexsearch",
  PUBLIC_FLEXSEARCH = "public-realm-flexsearch",
}
