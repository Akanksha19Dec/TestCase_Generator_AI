import OpenAI from 'openai';
import { ILLMProvider } from './ILLMProvider';
import { LLMResponse, ProviderOptions } from '../../types';
import { config } from '../../config/env';
import { logger } from '../../utils/logger';

export class OpenAIProvider implements ILLMProvider {
  name = 'OpenAI';
  private client: OpenAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || config.openai.apiKey;
    if (!key) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ apiKey: key });
    this.model = model || config.openai.model;
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<LLMResponse> {
    const model = options?.model || this.model;
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens || 2000;

    try {
      logger.debug(`[OpenAI] Generating response`, { model, promptLength: prompt.length });

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

      logger.debug(`[OpenAI] Response received`, {
        contentLength: content.length,
        tokens: response.usage?.total_tokens,
      });

      return {
        content,
        model,
        usage: response.usage
          ? {
              promptTokens: response.usage.prompt_tokens,
              completionTokens: response.usage.completion_tokens,
              totalTokens: response.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      logger.error('[OpenAI] Generation failed', error);

      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          throw new Error('Invalid OpenAI API key');
        }
        if (error.status === 429) {
          throw new Error('OpenAI rate limit exceeded. Please try again later.');
        }
        throw new Error(`OpenAI API error: ${error.message}`);
      }

      throw error;
    }
  }

  async validate(): Promise<boolean> {
    try {
      // Try to list models as a validation check
      await this.client.models.list();
      return true;
    } catch (error) {
      logger.warn('[OpenAI] Validation failed', error);
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
