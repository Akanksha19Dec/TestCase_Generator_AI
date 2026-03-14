import { Router, Request, Response, NextFunction } from 'express';
import { TestCaseGeneratorService } from '../services/testCaseGenerator';
import { GenerateTestsRequest } from '../types';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/generate-tests
 * Generate test cases from requirement
 */
router.post('/generate-tests', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req.body as GenerateTestsRequest;

    logger.info('Received generate-tests request', {
      provider: request.provider,
      requirementLength: request.requirement?.length,
    });

    const response = await TestCaseGeneratorService.generateTestCases(request);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * GET /api/providers
 * List available LLM providers
 */
router.get('/providers', (_req: Request, res: Response) => {
  try {
    const providers = TestCaseGeneratorService.getAvailableProviders();
    res.status(200).json({
      providers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch providers',
    });
  }
});

export default router;
