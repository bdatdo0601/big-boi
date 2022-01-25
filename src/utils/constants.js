export const PHOTO_UPLOAD_PREFIX = "PHOTO_UPLOAD/";

export const POST_STATE = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
};

export const VERSION = process.env.REACT_APP_VERSION || "0.0.0";

export const WEBSITE_TITLE = process.env.REACT_APP_WEBSITE_TITLE || "Dat Do";

export const RESUME = {
  PREFIX: "resume/",
  SCHEMA_FILE: "schema.json",
};

export const REFERENCE_TAGS = {
  PREFIX: "reference/",
  FILE_NAME: "reference_tags.json",
};

export const DragDropTypes = {
  LINK: "LINK",
};

export default {
  POST_STATE,
  PHOTO_UPLOAD_PREFIX,
};
