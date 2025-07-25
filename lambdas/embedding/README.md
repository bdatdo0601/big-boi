# Embedding Lambda

A serverless function that generates text embeddings using Mistral AI and stores them in AWS S3 Vector Search.

## Features

- **Multi-format Support**: Process TEXT, HTML, Markdown, and JSON content
- **Intelligent Chunking**: Automatic document chunking with configurable parameters
- **Vector Storage**: Optional integration with AWS S3 Vector Search
- **Scalable Processing**: Handle multiple documents in a single request
- **Error Handling**: Comprehensive error handling and logging

## Architecture

```
Input Documents → Document Parsing → Chunking → Embedding Generation → Vector Storage (Optional)
```

## Dependencies

- **@ai-sdk/mistral**: Mistral AI integration for embeddings
- **@aws-sdk/client-s3vectors**: AWS S3 Vector Search client
- **@mastra/rag**: Document processing and chunking
- **@big-boi-commons/typescript**: Shared utilities and types

## Environment Variables

```bash
LLM_SECRET_ARN=arn:aws:secretsmanager:region:account:secret:llm-secrets
S3_VECTOR_BUCKET_ARN=arn:aws:s3:::your-vector-bucket
TEXT_EMBEDDINGS_INDEX_NAME=your-embeddings-index
AWS_REGION=us-east-1
```

## Request Format

```typescript
interface EmbeddingRequest {
  items: EmbeddingRequestItem[];
  writeToVectorStore?: boolean;
}

interface EmbeddingRequestItem {
  content: string;
  contentType: TextContentType;
  metadata?: EmbeddingMetadata;
}

enum TextContentType {
  TEXT = "text",
  HTML = "html",
  MARKDOWN = "markdown",
  JSON = "json"
}
```

## Response Format

```typescript
interface EmbeddingResponse {
  items: EmbeddingResponseItem[];
}

interface EmbeddingResponseItem {
  id: string;
  text: string;
  embedding: number[];
  metadata: EmbeddingMetadata;
}
```

## Example Usage

```typescript
const request = {
  items: [
    {
      content: "# Sample Document\n\nThis is a markdown document.",
      contentType: TextContentType.MARKDOWN,
      metadata: {
        id: "doc-1",
        title: "Sample Document",
        category: "documentation"
      }
    }
  ],
  writeToVectorStore: true
};

const response = await handler(request);
```

## Testing

### Prerequisites

Install test dependencies:

```bash
npm install
```

### Running Tests

```bash
# Run all tests once
npm test

# Run specific test types
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests only
npm run test:setup             # Test setup verification

# Run tests in watch mode (re-runs on file changes)
npm run test:watch             # All tests
npm run test:watch:unit        # Unit tests only
npm run test:watch:integration # Integration tests only

# Run tests with coverage report
npm run test:coverage                 # All tests with coverage
npm run test:coverage:unit           # Unit tests with coverage
npm run test:coverage:integration    # Integration tests with coverage
```

### Test Structure

The test suite is organized in a dedicated `test/` directory:

```
test/
├── setup/                       # Test configuration and setup
│   ├── test-setup.ts           # Global test setup and mocks
│   └── vitest-setup.test.ts    # Vitest configuration verification
├── unit/                        # Unit tests
│   └── index.test.ts           # Core lambda handler unit tests
└── integration/                 # Integration tests
    └── embedding.test.ts       # End-to-end integration tests
```

- **Setup Tests** (`test/setup/`): Verify test environment and Vitest configuration
- **Unit Tests** (`test/unit/`): Test individual functions and error handling in isolation
- **Integration Tests** (`test/integration/`): Test end-to-end workflows and real-world scenarios

### Test Features

#### Unit Tests
- ✅ Embedding model call mocking with Vitest
- ✅ AWS S3 Vector client mocking
- ✅ Document processing pipeline testing
- ✅ Error handling validation
- ✅ Content type handling
- ✅ Metadata preservation
- ✅ Vector store integration

#### Integration Tests
- ✅ Real-world document processing
- ✅ Multi-format content handling
- ✅ Large document processing
- ✅ Concurrent request handling
- ✅ Performance benchmarking

### Mock Configuration

Key mocks implemented with Vitest:

```typescript
import { vi } from 'vitest';

// Mistral AI embedding model
vi.mock('@ai-sdk/mistral');
vi.mock('ai', () => ({
  embedMany: vi.fn().mockResolvedValue({
    values: ['text chunks'],
    embeddings: [[0.1, 0.2, 0.3]]
  })
}));

// AWS S3 Vector client
vi.mock('@aws-sdk/client-s3vectors');

// Document processing
vi.mock('@mastra/rag', () => ({
  MDocument: {
    fromText: vi.fn(),
    fromHTML: vi.fn(),
    fromMarkdown: vi.fn(),
    fromJSON: vi.fn()
  }
}));

// Secrets manager
vi.mock('@big-boi-commons/typescript', async () => {
  const actual = await vi.importActual('@big-boi-commons/typescript');
  return {
    ...actual,
    getSecret: vi.fn().mockResolvedValue('mock-api-key'),
    hashToSha256: vi.fn().mockImplementation(input => `hash-${input.length}`)
  };
});
```

### Test Scenarios

#### Unit Tests Cover
- **Document Types**: Plain text, HTML, Markdown, JSON processing
- **Error Handling**: Network failures, invalid inputs, service errors
- **Edge Cases**: Empty content, missing metadata, mismatched data
- **Vector Store**: Both enabled and disabled scenarios
- **Content Processing**: Chunking, embedding generation, metadata handling

#### Integration Tests Cover
- **Real-world Documents**: Complex markdown, HTML pages, JSON data
- **Performance**: Large document processing, concurrent requests
- **End-to-end Workflows**: Complete document processing pipelines
- **Mixed Content**: Multiple content types in single request
- **Error Scenarios**: Service failures and recovery

### Coverage Goals

Target test coverage:
- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >95%
- **Lines**: >90%

## Building

```bash
# Install dependencies and build
npm run build
```

## Testing Framework

This project uses **Vitest** for testing, which provides:

- ⚡ **Fast execution** - Native ESM support and fast startup
- 🔧 **Jest-compatible API** - Easy migration from Jest
- 📊 **Built-in coverage** - V8 coverage reports
- 🎯 **TypeScript support** - First-class TypeScript integration
- 🔄 **Watch mode** - Intelligent file watching and re-running
- 🧩 **ESM/CommonJS** - Works with both module systems

### Key Vitest Features Used

- **vi.mock()** - Module mocking with auto-hoisting
- **vi.fn()** - Function mocking and spying
- **Coverage reporting** - V8-powered coverage with thresholds
- **TypeScript integration** - Native TS support without transpilation
- **Globals** - describe, it, expect available globally

## Deployment

The lambda is deployed using AWS CDK. See the main project documentation for deployment instructions.

## Monitoring

Key metrics to monitor:
- Processing time per document
- Embedding generation success rate
- Vector store write success rate
- Memory usage
- Error rates by content type

## Troubleshooting

### Common Issues

1. **Embedding model timeouts**
   - Check Mistral API key validity
   - Verify network connectivity
   - Monitor rate limits

2. **Vector store write failures**
   - Verify S3 Vector bucket permissions
   - Check index configuration
   - Validate vector dimensions

3. **Memory issues with large documents**
   - Adjust chunking parameters
   - Monitor Lambda memory allocation
   - Consider document size limits

### Debug Mode

Enable verbose logging by setting:
```bash
NODE_ENV=development
LOG_LEVEL=debug
```
