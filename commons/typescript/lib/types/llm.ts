import { z } from "zod";
import { TextContentType } from "../enums";

export const EmbeddingMetadataSchema = z
  .object({
    id: z.string(),
  })
  .and(z.any());

export const EmbeddingRequestItemSchema = z.object({
  content: z.string(),
  contentType: z.enum(TextContentType),
  metadata: EmbeddingMetadataSchema.optional(),
});

export const EmbeddingRequestSchema = z.object({
  items: z.array(EmbeddingRequestItemSchema),
  writeToVectorStore: z.boolean().optional(),
});

export const EmbeddingResponseItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  embedding: z.array(z.number()),
  metadata: EmbeddingMetadataSchema,
});

export const EmbeddingResponseSchema = z.object({
  items: z.array(EmbeddingResponseItemSchema),
});

export type EmbeddingRequest = z.infer<typeof EmbeddingRequestSchema>;
export type EmbeddingResponse = z.infer<typeof EmbeddingResponseSchema>;
export type EmbeddingResponseItem = z.infer<typeof EmbeddingResponseItemSchema>;
export type EmbeddingMetadata = z.infer<typeof EmbeddingMetadataSchema>;
export type EmbeddingRequestItem = z.infer<typeof EmbeddingRequestItemSchema>;
