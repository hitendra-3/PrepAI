/**
 * Validates incoming client generation requests
 */
export function validateGenerateRequest(body) {
  const { input, mode = 'both', difficulty = 'medium', count = 10 } = body || {};

  if (!input || typeof input !== 'string' || !input.trim()) {
    return {
      valid: false,
      error: 'Input text or study topic is required.',
      code: 'EMPTY_INPUT',
      statusCode: 400,
    };
  }

  if (input.trim().length > 15000) {
    return {
      valid: false,
      error: 'Input is too long. Please limit to under 15,000 characters.',
      code: 'EXCESSIVE_LENGTH',
      statusCode: 400,
    };
  }

  if (!['flashcards', 'quiz', 'both'].includes(mode)) {
    return {
      valid: false,
      error: "Generation mode must be 'flashcards', 'quiz', or 'both'.",
      code: 'INVALID_MODE',
      statusCode: 400,
    };
  }

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return {
      valid: false,
      error: "Difficulty must be 'easy', 'medium', or 'hard'.",
      code: 'INVALID_DIFFICULTY',
      statusCode: 400,
    };
  }

  const itemCount = parseInt(count, 10);
  if (isNaN(itemCount) || itemCount < 1 || itemCount > 30) {
    return {
      valid: false,
      error: 'Count must be an integer between 1 and 30.',
      code: 'INVALID_COUNT',
      statusCode: 400,
    };
  }

  return {
    valid: true,
    data: {
      input: input.trim(),
      mode,
      difficulty,
      count: itemCount,
    },
  };
}
