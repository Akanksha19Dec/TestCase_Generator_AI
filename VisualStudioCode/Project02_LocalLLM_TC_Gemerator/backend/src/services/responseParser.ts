import { TestCase } from '../types';
import { logger } from '../utils/logger';

export class ResponseParser {
  /**
   * Parse LLM response to test cases
   */
  static parseTestCases(content: string): TestCase[] {
    try {
      logger.debug('[Parser] Parsing response', { contentLength: content.length });

      // Try to extract JSON from response
      const json = this.extractJSON(content);
      
      if (!Array.isArray(json)) {
        throw new Error('Response must be a JSON array');
      }

      if (json.length === 0) {
        throw new Error('No test cases generated');
      }

      // Parse and validate each test case
      const testCases = json.map((item, index) => {
        return this.parseTestCase(item, index + 1);
      });

      logger.debug('[Parser] Successfully parsed test cases', { count: testCases.length });

      return testCases;
    } catch (error) {
      logger.error('[Parser] Parsing failed', error);
      throw error;
    }
  }

  /**
   * Extract JSON from text response
   */
  private static extractJSON(text: string): unknown {
    // Remove markdown code blocks if present
    let cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Try to find JSON array
    const arrayMatch = cleaned.match(/\[\s*{[\s\S]*}\s*\]/);
    if (arrayMatch) {
      cleaned = arrayMatch[0];
    }

    // Parse JSON
    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      logger.error('[Parser] JSON parsing failed', parseError);
      throw new Error('Failed to parse response as JSON');
    }
  }

  /**
   * Parse and validate individual test case
   */
  private static parseTestCase(item: unknown, index: number): TestCase {
    if (!item || typeof item !== 'object') {
      throw new Error(`Test case ${index} is not a valid object`);
    }

    const obj = item as Record<string, unknown>;

    // Validate required fields
    const requiredFields = [
      'title',
      'preconditions',
      'steps',
      'expectedResult',
    ];

    for (const field of requiredFields) {
      if (!obj[field] || typeof obj[field] !== 'string') {
        throw new Error(
          `Test case ${index} missing or invalid "${field}" field`
        );
      }
    }

    // Build test case
    const testCaseId = obj.testCaseId || `TC_${String(index).padStart(3, '0')}`;
    
    return {
      testCaseId: String(testCaseId),
      title: String(obj.title).substring(0, 100),
      preconditions: String(obj.preconditions),
      steps: String(obj.steps),
      expectedResult: String(obj.expectedResult),
      actualResult: 'Pending', // Always set to Pending
      status: 'Not Executed', // Always set to Not Executed
    };
  }

  /**
   * Validate test case format
   */
  static validateTestCase(testCase: TestCase): { valid: boolean; error?: string } {
    if (!testCase.testCaseId) {
      return { valid: false, error: 'Test case ID is required' };
    }

    if (!testCase.title || testCase.title.trim().length === 0) {
      return { valid: false, error: 'Test case title is required' };
    }

    if (testCase.title.length > 100) {
      return {
        valid: false,
        error: `Test case title exceeds 100 characters (${testCase.title.length})`,
      };
    }

    if (!testCase.steps || testCase.steps.trim().length === 0) {
      return { valid: false, error: 'Test case steps cannot be empty' };
    }

    if (!testCase.expectedResult || testCase.expectedResult.trim().length === 0) {
      return { valid: false, error: 'Expected result cannot be empty' };
    }

    if (testCase.actualResult !== 'Pending') {
      return {
        valid: false,
        error: `actualResult must be "Pending", got "${testCase.actualResult}"`,
      };
    }

    if (testCase.status !== 'Not Executed') {
      return {
        valid: false,
        error: `status must be "Not Executed", got "${testCase.status}"`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate all test cases
   */
  static validateAllTestCases(testCases: TestCase[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const testCase of testCases) {
      const validation = this.validateTestCase(testCase);
      if (!validation.valid) {
        errors.push(`${testCase.testCaseId}: ${validation.error}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
