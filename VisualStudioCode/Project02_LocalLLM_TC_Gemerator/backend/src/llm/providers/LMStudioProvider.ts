import axios from 'axios';
import { ILLMProvider } from './ILLMProvider';
import { LLMResponse, ProviderOptions } from '../../types';
import { config } from '../../config/env';
import { logger } from '../../utils/logger';

export class LMStudioProvider implements ILLMProvider {
  name = 'LM Studio';
  private url: string;
  private model: string;

  constructor(url?: string, model?: string) {
    this.url = url || config.lmStudio.url;
    this.model = model || config.lmStudio.model;
  }

  async generate(prompt: string, options?: ProviderOptions): Promise<LLMResponse> {
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens || 2000;
    const timeout = options?.timeout || 60000;

    try {
      logger.debug(`[LM Studio] Generating response`, { promptLength: prompt.length });

      // LM Studio uses OpenAI-compatible API
      const response = await axios.post(
        `${this.url}/v1/chat/completions`,
        {
          model: 'local-model',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature,
          max_tokens: maxTokens,
          stream: false,
        },
        { timeout }
      );

      const content = response.data.choices?.[0]?.message?.content || '';

      logger.debug(`[LM Studio] Response received`, { contentLength: content.length });

      return {
        content,
        model: 'lm-studio-local',
      };
    } catch (error) {
      logger.error('[LM Studio] Generation failed', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error(
            'LM Studio connection failed. Make sure LM Studio is running on ' + this.url
          );
        }
        if (error.code === 'ENOTFOUND') {
          throw new Error('LM Studio host not found: ' + this.url);
        }
        throw new Error(`LM Studio API error: ${error.message}`);
      }

      throw error;
    }
  }

  async validate(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.url}/v1/models`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      logger.warn('[LM Studio] Validation failed', error);
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
