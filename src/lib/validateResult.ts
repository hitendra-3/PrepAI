import { StudySetData, FlashcardItem, QuizQuestionItem } from '../types/study';

export interface ValidationSuccess {
  valid: true;
  data: StudySetData;
}

export interface ValidationFailure {
  valid: false;
  error: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Validates the raw parsed object from the LLM or API endpoint before rendering in React.
 * Prevents UI crashes and ensures all required fields and structural guarantees are satisfied.
 */
export function validateResult(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      valid: false,
      error: 'Invalid response format: Expected an object at top level.',
    };
  }

  const raw = data as Record<string, any>;

  // 1. Title check
  if (typeof raw.title !== 'string' || !raw.title.trim()) {
    return {
      valid: false,
      error: 'Validation failed: Study set is missing a valid title.',
    };
  }

  // 2. Summary check
  if (typeof raw.summary !== 'string' || !raw.summary.trim()) {
    return {
      valid: false,
      error: 'Validation failed: Study set is missing a valid summary.',
    };
  }

  // 3. Flashcards array validation
  if (!Array.isArray(raw.flashcards)) {
    return {
      valid: false,
      error: 'Validation failed: "flashcards" must be an array.',
    };
  }

  const validatedFlashcards: FlashcardItem[] = [];
  for (let i = 0; i < raw.flashcards.length; i++) {
    const card = raw.flashcards[i];
    if (!card || typeof card !== 'object') {
      return {
        valid: false,
        error: `Validation failed: Flashcard #${i + 1} is not a valid object.`,
      };
    }

    if (typeof card.question !== 'string' || !card.question.trim()) {
      return {
        valid: false,
        error: `Validation failed: Flashcard #${i + 1} has an empty or invalid question.`,
      };
    }

    if (typeof card.answer !== 'string' || !card.answer.trim()) {
      return {
        valid: false,
        error: `Validation failed: Flashcard #${i + 1} has an empty or invalid answer.`,
      };
    }

    const keyPoint =
      typeof card.keyPoint === 'string' && card.keyPoint.trim()
        ? card.keyPoint.trim()
        : card.answer.slice(0, 100);

    validatedFlashcards.push({
      id: card.id ? String(card.id) : `fc-${i + 1}`,
      question: card.question.trim(),
      answer: card.answer.trim(),
      keyPoint,
    });
  }

  // 4. Quiz array validation
  if (!Array.isArray(raw.quiz)) {
    return {
      valid: false,
      error: 'Validation failed: "quiz" must be an array.',
    };
  }

  const validatedQuiz: QuizQuestionItem[] = [];
  for (let i = 0; i < raw.quiz.length; i++) {
    const q = raw.quiz[i];
    if (!q || typeof q !== 'object') {
      return {
        valid: false,
        error: `Validation failed: Quiz question #${i + 1} is not a valid object.`,
      };
    }

    if (typeof q.question !== 'string' || !q.question.trim()) {
      return {
        valid: false,
        error: `Validation failed: Quiz question #${i + 1} has an empty or invalid question.`,
      };
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return {
        valid: false,
        error: `Validation failed: Quiz question #${i + 1} must have exactly 4 answer options.`,
      };
    }

    const cleanedOptions: string[] = [];
    for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
      const opt = q.options[optIdx];
      if (typeof opt !== 'string' || !opt.trim()) {
        return {
          valid: false,
          error: `Validation failed: Quiz question #${i + 1}, option ${optIdx + 1} is empty or not a string.`,
        };
      }
      cleanedOptions.push(opt.trim());
    }

    if (
      typeof q.correctAnswer !== 'number' ||
      !Number.isInteger(q.correctAnswer) ||
      q.correctAnswer < 0 ||
      q.correctAnswer > 3
    ) {
      return {
        valid: false,
        error: `Validation failed: Quiz question #${i + 1} correctAnswer must be an integer index between 0 and 3.`,
      };
    }

    const explanation =
      typeof q.explanation === 'string' && q.explanation.trim()
        ? q.explanation.trim()
        : `Option ${String.fromCharCode(65 + q.correctAnswer)} is the correct answer.`;

    validatedQuiz.push({
      id: q.id ? String(q.id) : `qz-${i + 1}`,
      question: q.question.trim(),
      options: [cleanedOptions[0], cleanedOptions[1], cleanedOptions[2], cleanedOptions[3]],
      correctAnswer: q.correctAnswer,
      explanation,
    });
  }

  // Key concepts
  const keyConcepts = Array.isArray(raw.keyConcepts)
    ? raw.keyConcepts.filter((c: unknown) => typeof c === 'string' && (c as string).trim().length > 0)
    : [];

  return {
    valid: true,
    data: {
      title: raw.title.trim(),
      summary: raw.summary.trim(),
      keyConcepts,
      flashcards: validatedFlashcards,
      quiz: validatedQuiz,
    },
  };
}
