import { LLMProvider, ProviderOptions } from '../types';
import { ILLMProvider } from './providers/ILLMProvider';
import { OllamaProvider } from './providers/OllamaProvider';
import { LMStudioProvider } from './providers/LMStudioProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { GroqProvider } from './providers/GroqProvider';
import { ClaudeProvider } from './providers/ClaudeProvider';
import { logger } from '../utils/logger';

export class ProviderFactory {
  static createProvider(provider: LLMProvider, options?: ProviderOptions): ILLMProvider {
    logger.debug(`Creating provider: ${provider}`, { model: options?.model });

    switch (provider) {
      case 'ollama':
        return new OllamaProvider(options?.baseUrl, options?.model);

      case 'lmstudio':
        return new LMStudioProvider(options?.baseUrl, options?.model);

      case 'openai':
        return new OpenAIProvider(options?.apiKey, options?.model);

      case 'groq':
        return new GroqProvider(options?.apiKey, options?.model);

      case 'claude':
        return new ClaudeProvider(options?.apiKey, options?.model);

      default:
        throw new Error(`Unknown LLM provider: ${provider}`);
    }
  }

  /**
   * Get all available provider configurations
   */
  static getAvailableProviders() {
    return [
      {
        id: 'ollama',
        name: 'Ollama',
        type: 'local',
        requiresApiKey: false,
        defaultModel: 'llama2',
        description: 'Local Ollama instance',
      },
      {
        id: 'lmstudio',
        name: 'LM Studio',
        type: 'local',
        requiresApiKey: false,
        defaultModel: 'default',
        description: 'Local LM Studio instance',
      },
      {
        id: 'openai',
        name: 'OpenAI',
        type: 'api',
        requiresApiKey: true,
        defaultModel: 'gpt-3.5-turbo',
        description: 'OpenAI GPT models',
      },
      {
        id: 'groq',
        name: 'Groq',
        type: 'api',
        requiresApiKey: true,
        defaultModel: 'mixtral-8x7b-32768',
        description: 'Groq fast inference',
      },
      {
        id: 'claude',
        name: 'Claude',
        type: 'api',
        requiresApiKey: true,
        defaultModel: 'claude-3-opus-20240229',
        description: 'Anthropic Claude models',
      },
    ];
  }
}
