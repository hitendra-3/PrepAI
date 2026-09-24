export type GenerationMode = 'flashcards' | 'quiz' | 'both';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  keyPoint: string;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: [string, string, string, string] | string[];
  correctAnswer: number; // 0-based index (0, 1, 2, or 3)
  explanation: string;
}

export interface StudySetData {
  title: string;
  summary: string;
  keyConcepts?: string[];
  flashcards: FlashcardItem[];
  quiz: QuizQuestionItem[];
}

export interface StudySetRecord {
  id: string;
  title: string;
  summary: string;
  keyConcepts?: string[];
  mode: GenerationMode;
  difficulty: Difficulty;
  createdAt: string;
  data: StudySetData;
  isFavorite?: boolean;
}

export interface GenerateRequest {
  input: string;
  mode: GenerationMode;
  difficulty: Difficulty;
  count: number;
}

export interface UserAnswerRecord {
  questionId: string;
  questionIndex: number;
  question: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizProgressState {
  currentQuestionIndex: number;
  selectedOption: number | null;
  isSubmitted: boolean;
  userAnswers: UserAnswerRecord[];
  score: number;
  isCompleted: boolean;
}
