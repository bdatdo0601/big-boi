import { createMistral } from "@ai-sdk/mistral";
import { S3VectorsClient } from "@aws-sdk/client-s3vectors";
import {
  EmbeddingRequest,
  LLMSecretKey,
  TextContentType,
} from "@big-boi-commons/typescript/lib";
import { embedMany } from "ai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handler } from "../../src/index";

// Mock all external dependencies
vi.mock("@ai-sdk/mistral");
vi.mock("@aws-sdk/client-s3vectors");
vi.mock("ai");
vi.mock("@mastra/rag", () => ({
  MDocument: {
    fromText: vi.fn(),
    fromHTML: vi.fn(),
    fromMarkdown: vi.fn(),
    fromJSON: vi.fn(),
  },
}));
vi.mock("@big-boi-commons/typescript/lib", async () => {
  const actual = await vi.importActual("@big-boi-commons/typescript/lib");
  return {
    ...actual,
    getSecret: vi.fn(),
    hashToSha256: vi.fn(),
  };
});

// Type the mocked modules
const mockCreateMistral = vi.mocked(createMistral);
const mockEmbedMany = vi.mocked(embedMany);
const mockS3VectorsClient = vi.mocked(S3VectorsClient);
const { MDocument: mockMDocument } = vi.mocked(await import("@mastra/rag"));

// Import the mocked functions
import { getSecret, hashToSha256 } from "@big-boi-commons/typescript/lib";

const mockGetSecret = vi.mocked(getSecret);
const mockHashToSha256 = vi.mocked(hashToSha256);

describe("Embedding Lambda Handler", () => {
  // Mock environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();

    // Set up environment variables
    process.env = {
      ...originalEnv,
      LLM_SECRET_ARN:
        "arn:aws:secretsmanager:us-east-1:123456789012:secret:test-secret",
      S3_VECTOR_BUCKET_ARN: "arn:aws:s3:::test-bucket",
      TEXT_EMBEDDINGS_INDEX_NAME: "test-index",
    };

    // Mock getSecret to return API key
    mockGetSecret.mockResolvedValue("test-mistral-api-key");

    // Mock hashToSha256 to return deterministic hash
    mockHashToSha256.mockImplementation(
      (input: string) => `hash-${input.length}`,
    );

    // Mock Mistral provider
    const mockMistralProvider = {
      textEmbeddingModel: vi.fn().mockReturnValue("mistral-embed-model"),
    };
    mockCreateMistral.mockReturnValue(mockMistralProvider as any);

    // Mock S3VectorsClient
    const mockS3Client = {
      send: vi.fn().mockResolvedValue({}),
    };
    mockS3VectorsClient.mockImplementation(() => mockS3Client as any);

    // Mock MDocument methods
    const mockChunk = vi.fn();
    const mockDocumentInstance = {
      chunk: mockChunk,
    };

    (mockMDocument.fromText as any).mockReturnValue(mockDocumentInstance);
    (mockMDocument.fromHTML as any).mockReturnValue(mockDocumentInstance);
    (mockMDocument.fromMarkdown as any).mockReturnValue(mockDocumentInstance);
    (mockMDocument.fromJSON as any).mockReturnValue(mockDocumentInstance);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("successful embedding generation", () => {
    it("should process text content and return embeddings without writing to vector store", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Hello world",
            contentType: TextContentType.TEXT,
            metadata: { id: "test-1", source: "test" },
          },
        ],
        writeToVectorStore: false,
      };

      const mockChunks = [{ text: "Hello world" }];

      const mockEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];

      // Setup mocks
      const mockDocumentInstance = {
        chunk: vi.fn().mockResolvedValue(mockChunks),
      };
      (mockMDocument.fromText as any).mockReturnValue(mockDocumentInstance);

      mockEmbedMany.mockResolvedValue({
        values: ["Hello world"],
        embeddings: [mockEmbedding],
        usage: {
          tokens: 100,
        },
      });

      // Act
      const result = await handler(request);

      // Assert
      expect(result.statusCode).toBe(200);

      const responseBody = JSON.parse(result.body);
      expect(responseBody.items).toHaveLength(1);
      expect(responseBody.items[0]).toEqual({
        id: "hash-11", // Hello world has 11 characters
        text: "Hello world",
        embedding: mockEmbedding,
        metadata: { id: "test-1", source: "test" },
      });

      // Verify external calls
      expect(mockGetSecret).toHaveBeenCalledWith(
        process.env.LLM_SECRET_ARN,
        LLMSecretKey.MISTRAL,
      );
      expect(mockMDocument.fromText).toHaveBeenCalledWith("Hello world");
      expect(mockDocumentInstance.chunk).toHaveBeenCalledWith({
        strategy: "recursive",
        size: 512,
        overlap: 50,
      });
      expect(mockEmbedMany).toHaveBeenCalledWith({
        values: ["Hello world"],
        model: "mistral-embed-model",
      });
    });

    it("should process multiple items and generate embeddings for all chunks", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "First document",
            contentType: TextContentType.TEXT,
            metadata: { id: "doc-1" },
          },
          {
            content: "Second document",
            contentType: TextContentType.MARKDOWN,
            metadata: { id: "doc-2" },
          },
        ],
        writeToVectorStore: false,
      };

      const mockChunks1 = [
        { text: "First document chunk 1" },
        { text: "First document chunk 2" },
      ];

      const mockChunks2 = [{ text: "Second document chunk 1" }];

      const mockEmbeddings = [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
        [0.7, 0.8, 0.9],
      ];

      // Setup mocks for first document
      const mockDoc1 = { chunk: vi.fn().mockResolvedValue(mockChunks1) };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc1);

      // Setup mocks for second document
      const mockDoc2 = { chunk: vi.fn().mockResolvedValue(mockChunks2) };
      (mockMDocument.fromMarkdown as any).mockReturnValue(mockDoc2);

      mockEmbedMany
        .mockResolvedValueOnce({
          values: ["First document chunk 1", "First document chunk 2"],
          embeddings: [mockEmbeddings[0], mockEmbeddings[1]],
          usage: {
            tokens: 100,
          },
        })
        .mockResolvedValueOnce({
          values: ["Second document chunk 1"],
          embeddings: [mockEmbeddings[2]],
          usage: {
            tokens: 100,
          },
        });

      // Act
      const result = await handler(request);

      // Assert
      expect(result.statusCode).toBe(200);

      const responseBody = JSON.parse(result.body);
      expect(responseBody.items).toHaveLength(3);

      // Verify first document chunks
      expect(responseBody.items[0]).toEqual({
        id: "hash-22", // 'First document chunk 1' length
        text: "First document chunk 1",
        embedding: mockEmbeddings[0],
        metadata: { id: "doc-1" },
      });
      expect(responseBody.items[1]).toEqual({
        id: "hash-22", // 'First document chunk 2' length
        text: "First document chunk 2",
        embedding: mockEmbeddings[1],
        metadata: { id: "doc-1" },
      });

      // Verify second document chunk
      expect(responseBody.items[2]).toEqual({
        id: "hash-23", // 'Second document chunk 1' length
        text: "Second document chunk 1",
        embedding: mockEmbeddings[2],
        metadata: { id: "doc-2" },
      });

      expect(mockMDocument.fromText).toHaveBeenCalledWith("First document");
      expect(mockMDocument.fromMarkdown).toHaveBeenCalledWith(
        "Second document",
      );
    });

    it("should handle different content types correctly", async () => {
      // Arrange
      const testCases = [
        {
          contentType: TextContentType.TEXT,
          content: "Plain text",
          mockMethod: "fromText",
        },
        {
          contentType: TextContentType.HTML,
          content: "<p>HTML content</p>",
          mockMethod: "fromHTML",
        },
        {
          contentType: TextContentType.MARKDOWN,
          content: "# Markdown",
          mockMethod: "fromMarkdown",
        },
        {
          contentType: TextContentType.JSON,
          content: '{"key": "value"}',
          mockMethod: "fromJSON",
        },
      ];

      for (const testCase of testCases) {
        // Reset mocks for each test case
        vi.clearAllMocks();

        const request: EmbeddingRequest = {
          items: [
            {
              content: testCase.content,
              contentType: testCase.contentType,
              metadata: { id: "test" },
            },
          ],
          writeToVectorStore: false,
        };

        const mockChunks = [{ text: testCase.content }];
        const mockDoc = { chunk: vi.fn().mockResolvedValue(mockChunks) };

        // Setup the appropriate mock method
        (mockMDocument as any)[testCase.mockMethod].mockReturnValue(mockDoc);

        mockEmbedMany.mockResolvedValue({
          values: [testCase.content],
          embeddings: [[0.1, 0.2, 0.3]],
          usage: {
            tokens: 100,
          },
        });

        // Act
        await handler(request);

        // Assert
        expect(
          (mockMDocument as any)[testCase.mockMethod],
        ).toHaveBeenCalledWith(testCase.content);
      }
    });
  });

  describe("vector store integration", () => {
    it("should write embeddings to vector store when writeToVectorStore is true", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Test content",
            contentType: TextContentType.TEXT,
            metadata: { id: "test-id", category: "test" },
          },
        ],
        writeToVectorStore: true,
      };

      const mockChunks = [{ text: "Test content" }];
      const mockEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];

      const mockDoc = { chunk: vi.fn().mockResolvedValue(mockChunks) };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc);

      mockEmbedMany.mockResolvedValue({
        values: ["Test content"],
        embeddings: [mockEmbedding],
        usage: {
          tokens: 100,
        },
      });

      const mockS3Client = new mockS3VectorsClient();

      // Act
      const result = await handler(request);

      // Assert
      expect(result.statusCode).toBe(200);
      expect(mockS3Client.send).toHaveBeenCalledTimes(1);
      expect(mockS3Client.send).toHaveBeenCalledWith(expect.any(Object));
    });

    it("should not write to vector store when writeToVectorStore is false", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Test content",
            contentType: TextContentType.TEXT,
          },
        ],
        writeToVectorStore: false,
      };

      const mockChunks = [{ text: "Test content" }];
      const mockDoc = { chunk: vi.fn().mockResolvedValue(mockChunks) };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc);

      mockEmbedMany.mockResolvedValue({
        values: ["Test content"],
        embeddings: [[0.1, 0.2, 0.3]],
        usage: {
          tokens: 100,
        },
      });

      const mockS3Client = new mockS3VectorsClient();

      // Act
      await handler(request);

      // Assert
      expect(mockS3Client.send).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should handle missing metadata gracefully", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Test without metadata",
            contentType: TextContentType.TEXT,
            // metadata is undefined
          },
        ],
        writeToVectorStore: false,
      };

      const mockChunks = [{ text: "Test without metadata" }];
      const mockDoc = { chunk: vi.fn().mockResolvedValue(mockChunks) };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc);

      mockEmbedMany.mockResolvedValue({
        values: ["Test without metadata"],
        embeddings: [[0.1, 0.2, 0.3]],
        usage: {
          tokens: 100,
        },
      });

      // Act
      const result = await handler(request);

      // Assert
      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.items[0].metadata).toEqual({
        id: "hash-21", // Default metadata with hash as id
      });
    });

    it("should handle empty chunks gracefully", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Test content",
            contentType: TextContentType.TEXT,
            metadata: { id: "test" },
          },
        ],
        writeToVectorStore: false,
      };

      const mockDoc = { chunk: vi.fn().mockResolvedValue([]) };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc);

      mockEmbedMany.mockResolvedValue({
        values: [],
        embeddings: [],
        usage: {
          tokens: 0,
        },
      });

      // Act
      const result = await handler(request);

      // Assert
      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.items).toHaveLength(0);
    });

    it("should handle mismatched values and embeddings arrays", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Test content",
            contentType: TextContentType.TEXT,
            metadata: { id: "test" },
          },
        ],
        writeToVectorStore: false,
      };

      const mockChunks = [{ text: "Test content" }];
      const mockDoc = { chunk: vi.fn().mockResolvedValue(mockChunks) };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc);

      // Mock mismatched arrays (more values than embeddings)
      mockEmbedMany.mockResolvedValue({
        values: ["Test content", "Extra value"],
        embeddings: [[0.1, 0.2, 0.3]], // Only one embedding,
        usage: {
          tokens: 100,
        },
      });

      // Act
      const result = await handler(request);

      // Assert
      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.items).toHaveLength(1); // Only processes matched pairs
    });

    it("should propagate errors from external services", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Test content",
            contentType: TextContentType.TEXT,
          },
        ],
        writeToVectorStore: false,
      };

      // Mock getSecret to throw an error
      mockGetSecret.mockRejectedValue(new Error("Failed to get secret"));

      // Act & Assert
      await expect(handler(request)).rejects.toThrow("Failed to get secret");
    });

    it("should handle embedding model errors", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Test content",
            contentType: TextContentType.TEXT,
          },
        ],
        writeToVectorStore: false,
      };

      const mockChunks = [{ text: "Test content" }];
      const mockDoc = { chunk: vi.fn().mockResolvedValue(mockChunks) };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc);

      // Mock embedMany to throw an error
      mockEmbedMany.mockRejectedValue(new Error("Embedding model error"));

      // Act & Assert
      await expect(handler(request)).rejects.toThrow("Embedding model error");
    });

    it("should handle vector store write errors", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Test content",
            contentType: TextContentType.TEXT,
          },
        ],
        writeToVectorStore: true,
      };

      const mockChunks = [{ text: "Test content" }];
      const mockDoc = { chunk: vi.fn().mockResolvedValue(mockChunks) };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc);

      mockEmbedMany.mockResolvedValue({
        values: ["Test content"],
        embeddings: [[0.1, 0.2, 0.3]],
        usage: {
          tokens: 100,
        },
      });

      // Mock S3 client to throw an error
      const mockS3Client = new mockS3VectorsClient();
      (mockS3Client.send as any).mockRejectedValue(new Error("S3 write error"));

      // Act & Assert
      await expect(handler(request)).rejects.toThrow("S3 write error");
    });
  });

  describe("chunking configuration", () => {
    it("should use correct chunking parameters", async () => {
      // Arrange
      const request: EmbeddingRequest = {
        items: [
          {
            content: "Long document that will be chunked",
            contentType: TextContentType.TEXT,
          },
        ],
        writeToVectorStore: false,
      };

      const mockDoc = {
        chunk: vi.fn().mockResolvedValue([{ text: "chunk" }]),
      };
      (mockMDocument.fromText as any).mockReturnValue(mockDoc);

      mockEmbedMany.mockResolvedValue({
        values: ["chunk"],
        embeddings: [[0.1, 0.2, 0.3]],
        usage: {
          tokens: 100,
        },
      });

      // Act
      await handler(request);

      // Assert
      expect(mockDoc.chunk).toHaveBeenCalledWith({
        strategy: "recursive",
        size: 512,
        overlap: 50,
      });
    });
  });
});
