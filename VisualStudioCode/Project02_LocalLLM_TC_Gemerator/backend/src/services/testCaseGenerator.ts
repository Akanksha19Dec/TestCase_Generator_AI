import {
  GenerateTestsRequest,
  GenerateTestsResponse,
  TestCase,
  LLMProvider,
  PROVIDERS_REQUIRING_KEY,
} from '../types';
import { ProviderFactory } from '../llm/factory';
import { ResponseParser } from './responseParser';
import { generateBasePrompt } from '../llm/prompts/basePrompt';
import { validators } from '../utils/validators';
import { logger } from '../utils/logger';

export class TestCaseGeneratorService {
  /**
   * Generate test cases from requirement
   */
  static async generateTestCases(
    request: GenerateTestsRequest
  ): Promise<GenerateTestsResponse> {
    try {
      // Validate request
      const validation = validators.validateGenerateRequest(request);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error || 'Invalid request',
        };
      }

      // Sanitize requirement
      const sanitizedRequirement = validators.sanitizeRequirement(request.requirement);

      logger.info('Generating test cases', {
        provider: request.provider,
        requirementLength: sanitizedRequirement.length,
      });

      // Generate prompt
      const prompt = generateBasePrompt(sanitizedRequirement);

      // Create LLM provider
      let provider;
      try {
        provider = ProviderFactory.createProvider(request.provider, {
          model: request.providerConfig?.model,
          temperature: request.providerConfig?.temperature,
          apiKey: request.apiKey,
        });
      } catch (error) {
        logger.error('Failed to create provider', error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to initialize LLM provider',
        };
      }

      // Generate response from LLM
      let llmResponse;
      try {
        llmResponse = await provider.generate(prompt, {
          temperature: request.providerConfig?.temperature ?? 0.7,
        });
      } catch (error) {
        logger.error('LLM generation failed', error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate test cases from LLM',
        };
      }

      // Parse response
      let testCases: TestCase[];
      try {
        testCases = ResponseParser.parseTestCases(llmResponse.content);
      } catch (error) {
        logger.error('Response parsing failed', error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to parse LLM response',
        };
      }

      // Validate test cases
      const allValidation = ResponseParser.validateAllTestCases(testCases);
      if (!allValidation.valid) {
        logger.warn('Test case validation failed', {
          errors: allValidation.errors,
        });
        return {
          success: false,
          error: `Test case validation failed:\n${allValidation.errors.join('\n')}`,
        };
      }

      logger.info('Successfully generated test cases', {
        provider: request.provider,
        count: testCases.length,
      });

      return {
        success: true,
        testCases,
      };
    } catch (error) {
      logger.error('Unexpected error in test case generation', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Get available providers
   */
  static getAvailableProviders() {
    return ProviderFactory.getAvailableProviders();
  }

  /**
   * Validate provider health
   */
  static async validateProvider(provider: LLMProvider, apiKey?: string) {
    try {
      const llmProvider = ProviderFactory.createProvider(provider, { apiKey });
      const isValid = await llmProvider.validate();
      return { valid: isValid, provider };
    } catch (error) {
      logger.error(`Provider validation failed for ${provider}`, error);
      return { valid: false, provider };
    }
  }
}
