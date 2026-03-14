import { LLMResponse, ProviderOptions } from '../../types';

export interface ILLMProvider {
  /**
   * Provider name (for logging)
   */
  name: string;

  /**
   * Generate response from LLM
   */
  generate(prompt: string, options?: ProviderOptions): Promise<LLMResponse>;

  /**
   * Validate provider is available
   */
  validate(): Promise<boolean>;

  /**
   * Get provider info
   */
  getInfo(): {
    name: string;
    model: string;
    type: 'local' | 'api';
  };
}
