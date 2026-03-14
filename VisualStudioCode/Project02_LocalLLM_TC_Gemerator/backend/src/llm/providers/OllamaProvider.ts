import axios from 'axios';
import { ILLMProvider } from './ILLMProvider';
import { LLMResponse, ProviderOptions } from '../../types';
import { config } from '../../config/env';
import { logger } from '../../utils/logger';

export class OllamaProvider implements ILLMProvider {
  name = 'Ollama';
  private url: string;
  private model: string;

  constructor(url?: string, model?: string) {
    this.url = url || config.ollama.url;
    this.model = model || config.ollama.model;
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<LLMResponse> {
    const model = options?.model || this.model;
    const temperature = options?.temperature ?? 0.7;
    const timeout = options?.timeout || 600000;

    try {
      logger.debug(`[Ollama] Generating response`, { model, promptLength: prompt.length });

      const response = await axios.post(
        `${this.url}/api/generate`,
        {
          model,
          prompt,
          temperature,
          stream: false,
        },
        { timeout }
      );

      const content = response.data.response || '';

      logger.debug(`[Ollama] Response received`, { contentLength: content.length });

      return {
        content,
        model,
      };
    } catch (error) {
      logger.error('[Ollama] Generation failed', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error(
            'Ollama connection failed. Make sure Ollama is running on ' + this.url
          );
        }
        if (error.code === 'ENOTFOUND') {
          throw new Error('Ollama host not found: ' + this.url);
        }
        throw new Error(`Ollama API error: ${error.message}`);
      }

      throw error;
    }
  }

  async validate(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.url}/api/tags`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      logger.warn('[Ollama] Validation failed', error);
      return false;
    }
  }

  getInfo() {
    return {
      name: this.name,
      model: this.model,
      type: 'local' as const,
    };
  }
}
