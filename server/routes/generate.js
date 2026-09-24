import express from 'express';
import { generateStudyMaterial } from '../services/llmService.js';
import { validateGenerateRequest } from '../validators/requestValidator.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    // 1. Strict Request Validation
    const requestValidation = validateGenerateRequest(req.body);
    if (!requestValidation.valid) {
      return res.status(requestValidation.statusCode).json({
        error: requestValidation.error,
        code: requestValidation.code,
      });
    }

    const { input, mode, difficulty, count } = requestValidation.data;

    // 2. Call LLM Service with multi-model failover
    const validationResult = await generateStudyMaterial({
      input,
      mode,
      difficulty,
      count,
    });

    if (!validationResult.valid) {
      return res.status(502).json({
        error: validationResult.error || 'Failed to generate a valid study set structure.',
        code: 'SCHEMA_VALIDATION_ERROR',
      });
    }

    // 3. Return clean, validated JSON
    return res.status(200).json(validationResult.data);
  } catch (error) {
    console.error('API Error in /api/generate:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred while generating study materials.',
      code: 'GENERATION_FAILED',
    });
  }
});

export default router;
