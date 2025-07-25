// Global test setup for Vitest
import { vi } from "vitest";

// Extend Vitest matchers if needed
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      // Add custom matchers here if needed
    }
  }
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment below to suppress console logs during tests
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.AWS_REGION = "us-east-1";

// Global test timeout (set in vitest.config.ts, but can be overridden here)
// vi.setConfig({ testTimeout: 10000 });
