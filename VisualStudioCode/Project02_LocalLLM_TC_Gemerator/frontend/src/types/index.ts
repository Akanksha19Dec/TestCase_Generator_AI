// TypeScript interfaces and types

export interface TestCase {
  testCaseId: string;
  title: string;
  preconditions: string;
  steps: string;
  expectedResult: string;
  actualResult: string;
  status: string;
}

export interface GenerateTestsRequest {
  requirement: string;
  provider: 'ollama' | 'lmstudio' | 'openai' | 'groq' | 'claude';
  apiKey?: string;
  providerConfig?: {
    model?: string;
    temperature?: number;
  };
}

export interface GenerateTestsResponse {
  success: boolean;
  testCases?: TestCase[];
  error?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  type: 'local' | 'api';
  requiresApiKey: boolean;
  defaultModel: string;
  description: string;
}

export type LLMProvider = 'ollama' | 'lmstudio' | 'openai' | 'groq' | 'claude';

export interface AppState {
  requirement: string;
  selectedProvider: LLMProvider;
  apiKey: string;
  testCases: TestCase[];
  loading: boolean;
  error: string | null;
}
