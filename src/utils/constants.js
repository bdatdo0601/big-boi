export const PHOTO_UPLOAD_PREFIX = "public/PHOTO_UPLOAD/";

export const POST_STATE = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
};
export const VERSION = import.meta.env.SITE_VERSION || "0.0.0";

export const WEBSITE_TITLE = import.meta.env.SITE_WEBSITE_TITLE || "Dat Do";

export const PUBLIC_URL = import.meta.env.PUBLIC_URL || "https://datbdo.com";

export const RESUME = {
  PREFIX: "public/resume/",
  SCHEMA_FILE: "schema.json",
};

export const REFERENCE_TAGS = {
  PREFIX: "public/reference/",
  FILE_NAME: "reference_tags.json",
};

export const DragDropTypes = {
  LINK: "LINK",
};

export default {
  POST_STATE,
  PHOTO_UPLOAD_PREFIX,
};
