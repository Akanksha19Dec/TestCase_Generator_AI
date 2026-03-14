import Groq from 'groq-sdk';
import { ILLMProvider } from './ILLMProvider';
import { LLMResponse, ProviderOptions } from '../../types';
import { config } from '../../config/env';
import { logger } from '../../utils/logger';

export class GroqProvider implements ILLMProvider {
  name = 'Groq';
  private client: Groq;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || config.groq.apiKey;
    if (!key) {
      throw new Error('Groq API key is required');
    }
    this.client = new Groq({ apiKey: key });
    this.model = model || config.groq.model;
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<LLMResponse> {
    const model = options?.model || this.model;
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens || 2000;

    try {
      logger.debug(`[Groq] Generating response`, { model, promptLength: prompt.length });

      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';

      logger.debug(`[Groq] Response received`, {
        contentLength: content.length,
        tokens: response.usage?.total_tokens,
      });

      return {
        content,
        model,
        usage: response.usage
          ? {
              promptTokens: response.usage.prompt_tokens || 0,
              completionTokens: response.usage.completion_tokens || 0,
              totalTokens: response.usage.total_tokens || 0,
            }
          : undefined,
      };
    } catch (error) {
      logger.error('[Groq] Generation failed', error);

      if (error instanceof Groq.APIError) {
        if (error.status === 401) {
          throw new Error('Invalid Groq API key');
        }
        if (error.status === 429) {
          throw new Error('Groq rate limit exceeded. Please try again later.');
        }
        throw new Error(`Groq API error: ${error.message}`);
      }

      throw error;
    }
  }

  async validate(): Promise<boolean> {
    try {
      // Try a minimal request to validate
      await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      });
      return true;
    } catch (error) {
      logger.warn('[Groq] Validation failed', error);
      return false;
    }
  }

  getInfo() {
    return {
      name: this.name,
      model: this.model,
      type: 'api' as const,
    };
  }
}
