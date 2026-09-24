import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { QuizQuestionItem } from '../../types/study';
import { useQuiz } from '../../hooks/useQuiz';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { WrongAnswerReview } from './WrongAnswerReview';

interface QuizViewProps {
  questions: QuizQuestionItem[];
  quizTitle: string;
  onBack: () => void;
}

type QuizSubView = 'taking' | 'results' | 'review';

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  quizTitle,
  onBack,
}) => {
  const [subView, setSubView] = useState<QuizSubView>('taking');

  const {
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
    selectOption,
    submitAnswer,
    nextQuestion,
    resetQuiz,
    retryWrongAnswers,
  } = useQuiz(questions);

  // Pure React state synchronization using useEffect (Issue #2 fix)
  useEffect(() => {
    if (isCompleted && subView === 'taking') {
      setSubView('results');
    }
  }, [isCompleted, subView]);

  const handleRetryWrong = () => {
    retryWrongAnswers();
    setSubView('taking');
  };

  const handleRetakeFull = () => {
    resetQuiz();
    setSubView('taking');
  };

  if (subView === 'results') {
    return (
      <QuizResults
        score={score}
        totalQuestions={totalQuestions}
        percentage={percentage}
        wrongAnswers={wrongAnswers}
        onReviewWrong={() => setSubView('review')}
        onRetakeQuiz={handleRetakeFull}
        onBackToOverview={onBack}
      />
    );
  }

  if (subView === 'review') {
    return (
      <WrongAnswerReview
        wrongAnswers={wrongAnswers}
        onRetryWrong={handleRetryWrong}
        onBackToResults={() => setSubView('results')}
      />
    );
  }

  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Exit Quiz</span>
        </button>

        <button onClick={handleRetakeFull} className="btn btn-ghost btn-sm" title="Restart quiz">
          <RotateCcw size={14} />
          <span>Restart</span>
        </button>
      </div>

      {/* Progress Bar & Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {quizTitle}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div style={{ height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: 'var(--secondary)',
              transition: 'width 0.25s ease',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          selectedOption={selectedOption}
          onSelectOption={selectOption}
          isSubmitted={isSubmitted}
          onSubmit={submitAnswer}
          onNext={nextQuestion}
        />
      )}
    </div>
  );
};
