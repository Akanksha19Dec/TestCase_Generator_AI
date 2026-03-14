import Anthropic from '@anthropic-ai/sdk';
import { ILLMProvider } from './ILLMProvider';
import { LLMResponse, ProviderOptions } from '../../types';
import { config } from '../../config/env';
import { logger } from '../../utils/logger';

export class ClaudeProvider implements ILLMProvider {
  name = 'Claude';
  private client: Anthropic;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || config.claude.apiKey;
    if (!key) {
      throw new Error('Claude API key is required');
    }
    this.client = new Anthropic({ apiKey: key });
    this.model = model || config.claude.model;
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<LLMResponse> {
    const model = options?.model || this.model;
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens || 2000;

    try {
      logger.debug(`[Claude] Generating response`, { model, promptLength: prompt.length });

      const response = await (this.client as any).messages.create({
        model,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
      });

      const content = response.content[0]?.type === 'text' ? response.content[0].text : '';

      logger.debug(`[Claude] Response received`, {
        contentLength: content.length,
        tokens: response.usage?.output_tokens,
      });

      return {
        content,
        model,
        usage: response.usage
          ? {
              promptTokens: response.usage.input_tokens,
              completionTokens: response.usage.output_tokens,
              totalTokens: response.usage.input_tokens + response.usage.output_tokens,
            }
          : undefined,
      };
    } catch (error) {
      logger.error('[Claude] Generation failed', error);

      if (error instanceof Anthropic.APIError) {
        if (error.status === 401) {
          throw new Error('Invalid Claude API key');
        }
        if (error.status === 429) {
          throw new Error('Claude rate limit exceeded. Please try again later.');
        }
        throw new Error(`Claude API error: ${error.message}`);
      }

      throw error;
    }
  }

  async validate(): Promise<boolean> {
    try {
      // Try a minimal request to validate
      await (this.client as any).messages.create({
        model: this.model,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    } catch (error) {
      logger.warn('[Claude] Validation failed', error);
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
