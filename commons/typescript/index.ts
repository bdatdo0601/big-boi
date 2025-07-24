export * from "./utils";

export enum TextContentType {
  TEXT = "text",
  HTML = "html",
  MARKDOWN = "markdown",
  JSON = "json",
}

export type EmbeddingRequest = {
  items: EmbeddingRequestItem[];
  writeToVectorStore?: boolean;
};

export type EmbeddingResponse = {
  items: EmbeddingResponseItem[];
};

export type EmbeddingResponseItem = {
  id: string;
  text: string;
  embedding: number[];
  metadata: EmbeddingMetadata;
};

export type EmbeddingMetadata = {
  id: string;
} & Record<string, any>;

export type EmbeddingRequestItem = {
  content: string;
  contentType: TextContentType;
  metadata?: EmbeddingMetadata;
};

export enum LLMSecretKey {
  MISTRAL = "MISTRAL_API_KEY",
  ANTHROPIC = "ANTHROPIC_API_KEY",
}
