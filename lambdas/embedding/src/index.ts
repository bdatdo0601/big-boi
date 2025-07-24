import { createMistral, MistralProvider } from "@ai-sdk/mistral";
import {
  PutVectorsCommand,
  PutVectorsInput,
  S3VectorsClient,
} from "@aws-sdk/client-s3vectors"; // ES Modules import
import {
  EmbeddingRequest,
  EmbeddingResponse,
  EmbeddingResponseItem,
  getSecret,
  hashToSha256,
  LLMSecretKey,
  TextContentType,
} from "@big-boi-commons/typescript";
import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { zip } from "lodash";

const initializeDocument = (
  content: string,
  contentType: TextContentType,
): MDocument => {
  switch (contentType) {
    case TextContentType.HTML:
      return MDocument.fromHTML(content);
    case TextContentType.MARKDOWN:
      return MDocument.fromMarkdown(content);
    case TextContentType.JSON:
      return MDocument.fromJSON(content);
    case TextContentType.TEXT:
    default:
      return MDocument.fromText(content);
  }
};

const getEmbeddings = async (
  chunks: string[],
  mistralProvider: MistralProvider,
) => {
  const embeddings = await embedMany({
    values: chunks,
    // dimension: 1024
    model: mistralProvider.textEmbeddingModel("mistral-embed"),
  });
  return embeddings;
};

const writeToVectorStore = async (
  vectorInputs: EmbeddingResponseItem[],
  client: S3VectorsClient,
) => {
  const input: PutVectorsInput = {
    indexArn: `${process.env.S3_VECTOR_BUCKET_ARN}/index/${process.env.TEXT_EMBEDDINGS_INDEX_NAME}`,
    vectors: vectorInputs.map((item) => ({
      key: hashToSha256(item.text),
      data: {
        float32: item.embedding,
      },
      metadata: item.metadata,
    })),
  };
  const command = new PutVectorsCommand(input);
  await client.send(command);
};

export const handler = async (
  event: EmbeddingRequest,
): Promise<{ statusCode: number; body: string }> => {
  const mistral = createMistral({
    apiKey: await getSecret(process.env.LLM_SECRET_ARN!, LLMSecretKey.MISTRAL),
  });
  const s3VectorsClient = new S3VectorsClient({ region: "us-east-1" });

  const results: EmbeddingResponse = {
    items: [],
  };

  for (const request of event.items) {
    const document = initializeDocument(request.content, request.contentType);

    const chunks = await document.chunk({
      strategy: "recursive",
      size: 512,
      overlap: 50,
    });

    const { values, embeddings } = await getEmbeddings(
      chunks.map((chunk) => chunk.text),
      mistral,
    );

    zip(values, embeddings).forEach(([text, embedding]) => {
      if (!text || !embedding) return;
      const id = hashToSha256(text);
      const embeddingResponseItem: EmbeddingResponseItem = {
        id,
        text,
        embedding,
        metadata: request.metadata || { id },
      };
      results.items.push(embeddingResponseItem);
    });
  }

  if (event.writeToVectorStore) {
    await writeToVectorStore(results.items, s3VectorsClient);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
