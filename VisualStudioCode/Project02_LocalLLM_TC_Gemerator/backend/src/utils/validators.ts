import { PROVIDERS_REQUIRING_KEY, LLMProvider } from '../types';

export const validators = {
  /**
   * Validate generate tests request
   */
  validateGenerateRequest(data: unknown): { valid: boolean; error?: string } {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid request body' };
    }

    const req = data as Record<string, unknown>;

    // Check requirement
    if (!req.requirement || typeof req.requirement !== 'string') {
      return { valid: false, error: 'Requirement must be a non-empty string' };
    }

    const requirement = req.requirement as string;
    if (requirement.trim().length < 10) {
      return { valid: false, error: 'Requirement must be at least 10 characters' };
    }

    if (requirement.length > 5000) {
      return {
        valid: false,
        error: 'Requirement must not exceed 5000 characters',
      };
    }

    // Check provider
    const validProviders = ['ollama', 'lmstudio', 'openai', 'groq', 'claude'];
    if (!req.provider || !validProviders.includes(req.provider as string)) {
      return {
        valid: false,
        error: `Provider must be one of: ${validProviders.join(', ')}`,
      };
    }

    const provider = req.provider as LLMProvider;

    // Check API key for providers that require it
    if (PROVIDERS_REQUIRING_KEY.includes(provider)) {
      if (!req.apiKey || typeof req.apiKey !== 'string') {
        return {
          valid: false,
          error: `API key is required for provider: ${provider}`,
        };
      }

      if (req.apiKey.trim().length === 0) {
        return {
          valid: false,
          error: `API key cannot be empty for provider: ${provider}`,
        };
      }
    }

    // Check provider config if provided
    if (req.providerConfig) {
      if (typeof req.providerConfig !== 'object') {
        return { valid: false, error: 'Provider config must be an object' };
      }

      const config = req.providerConfig as Record<string, unknown>;

      if (config.temperature !== undefined) {
        if (typeof config.temperature !== 'number') {
          return { valid: false, error: 'Temperature must be a number' };
        }
        if (config.temperature < 0 || config.temperature > 1) {
          return {
            valid: false,
            error: 'Temperature must be between 0 and 1',
          };
        }
      }

      if (config.model !== undefined && typeof config.model !== 'string') {
        return { valid: false, error: 'Model must be a string' };
      }
    }

    return { valid: true };
  },

  /**
   * Sanitize requirement text
   */
  sanitizeRequirement(requirement: string): string {
    return requirement
      .trim()
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .substring(0, 5000);
  },

  /**
   * Validate API key format
   */
  validateApiKey(apiKey: string | undefined, provider: LLMProvider): boolean {
    if (!apiKey) {
      return !PROVIDERS_REQUIRING_KEY.includes(provider);
    }

    // Basic format checks
    switch (provider) {
      case 'openai':
        return apiKey.startsWith('sk-') && apiKey.length > 20;
      case 'groq':
        return apiKey.startsWith('gsk_') && apiKey.length > 20;
      case 'claude':
        return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
      default:
        return true;
    }
  },
};
