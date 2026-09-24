import { useState, useMemo, useCallback } from 'react';
import { QuizQuestionItem, UserAnswerRecord } from '../types/study';

export function useQuiz(initialQuestions: QuizQuestionItem[]) {
  const [questions, setQuestions] = useState<QuizQuestionItem[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Sync questions if initialQuestions changes
  const setQuizQuestions = useCallback((newQuestions: QuizQuestionItem[]) => {
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setIsCompleted(false);
  }, []);

  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;

  const selectOption = useCallback(
    (index: number) => {
      if (!isSubmitted && !isCompleted) {
        setSelectedOption(index);
      }
    },
    [isSubmitted, isCompleted]
  );

  const submitAnswer = useCallback(() => {
    if (selectedOption === null || isSubmitted || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const answerRecord: UserAnswerRecord = {
      questionId: currentQuestion.id,
      questionIndex: currentQuestionIndex,
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedAnswer: selectedOption,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation,
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
    setIsSubmitted(true);
  }, [selectedOption, isSubmitted, currentQuestion, currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevRecord = userAnswers[currentQuestionIndex - 1];
      if (prevRecord) {
        setSelectedOption(prevRecord.selectedAnswer);
        setIsSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
    }
  }, [currentQuestionIndex, userAnswers]);

  const score = useMemo(() => {
    return userAnswers.filter((a) => a.isCorrect).length;
  }, [userAnswers]);

  const wrongAnswers = useMemo(() => {
    return userAnswers.filter((a) => !a.isCorrect);
  }, [userAnswers]);

  const percentage = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((score / totalQuestions) * 100);
  }, [score, totalQuestions]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setIsCompleted(false);
  }, []);

  /**
   * Reuses the existing wrong questions in-memory without making an LLM API call.
   */
  const retryWrongAnswers = useCallback(() => {
    const wrongQuestionIds = new Set(wrongAnswers.map((w) => w.questionId));
    const filteredQuestions = questions.filter((q) => wrongQuestionIds.has(q.id));

    if (filteredQuestions.length > 0) {
      setQuestions(filteredQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setUserAnswers([]);
      setIsCompleted(false);
    }
  }, [wrongAnswers, questions]);

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedOption,
    isSubmitted,
    userAnswers,
    wrongAnswers,
    score,
    percentage,
    isCompleted,
    setQuizQuestions,
    selectOption,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    retryWrongAnswers,
  };
}
