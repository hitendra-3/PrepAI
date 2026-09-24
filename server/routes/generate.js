import express from 'express';
import { generateStudyMaterial } from '../services/llmService.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { input, mode = 'both', difficulty = 'medium', count = 10 } = req.body;

    // 1. Validation of incoming request
    if (!input || typeof input !== 'string' || !input.trim()) {
      return res.status(400).json({
        error: 'Input text or topic is required.',
        code: 'EMPTY_INPUT',
      });
    }

    if (input.trim().length > 15000) {
      return res.status(400).json({
        error: 'Input is too long. Please limit to under 15,000 characters.',
        code: 'EXCESSIVE_LENGTH',
      });
    }

    if (!['flashcards', 'quiz', 'both'].includes(mode)) {
      return res.status(400).json({
        error: "Mode must be 'flashcards', 'quiz', or 'both'.",
        code: 'INVALID_MODE',
      });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        error: "Difficulty must be 'easy', 'medium', or 'hard'.",
        code: 'INVALID_DIFFICULTY',
      });
    }

    const itemCount = parseInt(count, 10);
    if (isNaN(itemCount) || itemCount < 1 || itemCount > 30) {
      return res.status(400).json({
        error: 'Count must be a number between 1 and 30.',
        code: 'INVALID_COUNT',
      });
    }

    // 2. Call LLM Service
    const validationResult = await generateStudyMaterial({
      input: input.trim(),
      mode,
      difficulty,
      count: itemCount,
    });

    if (!validationResult.valid) {
      return res.status(502).json({
        error: validationResult.error || 'Failed to generate a valid study set structure.',
        code: 'SCHEMA_VALIDATION_ERROR',
      });
    }

    // 3. Return clean, structured JSON
    return res.json(validationResult.data);
  } catch (error) {
    console.error('API Error in /api/generate:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred while generating study materials.',
      code: 'GENERATION_FAILED',
    });
  }
});

export default router;
