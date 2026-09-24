import { generateStudyMaterial } from '../server/services/llmService.js';

export default async function handler(req, res) {
  // Enable CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const { input, mode = 'both', difficulty = 'medium', count = 10 } = req.body || {};

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

    const itemCount = parseInt(count, 10);
    const validCount = isNaN(itemCount) || itemCount < 1 ? 10 : Math.min(itemCount, 30);

    const validationResult = await generateStudyMaterial({
      input: input.trim(),
      mode,
      difficulty,
      count: validCount,
    });

    if (!validationResult.valid) {
      return res.status(502).json({
        error: validationResult.error || 'Failed to generate a valid study set structure.',
        code: 'SCHEMA_VALIDATION_ERROR',
      });
    }

    return res.status(200).json(validationResult.data);
  } catch (error) {
    console.error('Vercel Serverless API Error in /api/generate:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred while generating study materials.',
      code: 'GENERATION_FAILED',
    });
  }
}
