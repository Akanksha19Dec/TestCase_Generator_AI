// Backend TypeScript interfaces

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
  provider: LLMProvider;
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

export interface LLMResponse {
  content: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  apiKey?: string;
  baseUrl?: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  provider?: string;
}

export const PROVIDERS_REQUIRING_KEY: LLMProvider[] = ['openai', 'groq', 'claude'];

export const DEFAULT_PROVIDERS: Record<LLMProvider, ProviderConfig> = {
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    type: 'local',
    requiresApiKey: false,
    defaultModel: 'llama2',
    description: 'Local Ollama instance',
  },
  lmstudio: {
    id: 'lmstudio',
    name: 'LM Studio',
    type: 'local',
    requiresApiKey: false,
    defaultModel: 'default',
    description: 'Local LM Studio instance',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    type: 'api',
    requiresApiKey: true,
    defaultModel: 'gpt-3.5-turbo',
    description: 'OpenAI GPT models',
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    type: 'api',
    requiresApiKey: true,
    defaultModel: 'mixtral-8x7b-32768',
    description: 'Groq fast inference',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    type: 'api',
    requiresApiKey: true,
    defaultModel: 'claude-3-opus-20240229',
    description: 'Anthropic Claude models',
  },
};
