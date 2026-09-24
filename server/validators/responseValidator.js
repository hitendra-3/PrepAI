/**
 * Strict validator and sanitizer for LLM responses
 */

export function cleanRawJsonText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let cleaned = rawText.trim();
  // Remove markdown code fences if present (```json ... ``` or ``` ...)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

export function validateStudySetSchema(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: 'Output must be a valid JSON object.' };
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    return { valid: false, error: 'Study set is missing a valid title string.' };
  }

  if (typeof data.summary !== 'string' || !data.summary.trim()) {
    return { valid: false, error: 'Study set is missing a valid summary string.' };
  }

  // Flashcards validation
  if (!Array.isArray(data.flashcards)) {
    return { valid: false, error: 'Flashcards field must be an array.' };
  }

  for (let i = 0; i < data.flashcards.length; i++) {
    const card = data.flashcards[i];
    if (!card || typeof card !== 'object') {
      return { valid: false, error: `Flashcard #${i + 1} must be an object.` };
    }
    if (typeof card.question !== 'string' || !card.question.trim()) {
      return { valid: false, error: `Flashcard #${i + 1} is missing a question.` };
    }
    if (typeof card.answer !== 'string' || !card.answer.trim()) {
      return { valid: false, error: `Flashcard #${i + 1} is missing an answer.` };
    }
    if (typeof card.keyPoint !== 'string' || !card.keyPoint.trim()) {
      card.keyPoint = card.answer.slice(0, 100);
    }
    if (!card.id) {
      card.id = `fc-${i + 1}`;
    }
  }

  // Quiz validation
  if (!Array.isArray(data.quiz)) {
    return { valid: false, error: 'Quiz field must be an array.' };
  }

  for (let i = 0; i < data.quiz.length; i++) {
    const q = data.quiz[i];
    if (!q || typeof q !== 'object') {
      return { valid: false, error: `Quiz question #${i + 1} must be an object.` };
    }
    if (typeof q.question !== 'string' || !q.question.trim()) {
      return { valid: false, error: `Quiz question #${i + 1} is missing a question.` };
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return { valid: false, error: `Quiz question #${i + 1} must have exactly 4 options.` };
    }
    for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
      if (typeof q.options[optIdx] !== 'string' || !q.options[optIdx].trim()) {
        return { valid: false, error: `Quiz question #${i + 1} option ${optIdx + 1} is empty.` };
      }
    }
    if (
      typeof q.correctAnswer !== 'number' ||
      !Number.isInteger(q.correctAnswer) ||
      q.correctAnswer < 0 ||
      q.correctAnswer > 3
    ) {
      return { valid: false, error: `Quiz question #${i + 1} correctAnswer must be an integer between 0 and 3.` };
    }
    if (typeof q.explanation !== 'string' || !q.explanation.trim()) {
      q.explanation = `Option ${String.fromCharCode(65 + q.correctAnswer)} is the correct answer.`;
    }
    if (!q.id) {
      q.id = `qz-${i + 1}`;
    }
  }

  // Key concepts formatting
  if (!Array.isArray(data.keyConcepts)) {
    data.keyConcepts = [];
  } else {
    data.keyConcepts = data.keyConcepts.filter((c) => typeof c === 'string' && c.trim().length > 0);
  }

  return { valid: true, data };
}
