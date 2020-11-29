export const PHOTO_UPLOAD_PREFIX = "PHOTO_UPLOAD/";

export const POST_STATE = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
};

export const VERSION = process.env.REACT_APP_VERSION || "0.0.0";

export const RESUME = {
  PREFIX: "resume/",
  SCHEMA_FILE: "schema.json",
};

export default {
  POST_STATE,
  PHOTO_UPLOAD_PREFIX,
};
