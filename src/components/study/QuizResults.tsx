import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  AlertCircle, 
  ArrowLeft,
  Sparkles 
} from 'lucide-react';
import { UserAnswerRecord } from '../../types/study';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  wrongAnswers: UserAnswerRecord[];
  onReviewWrong: () => void;
  onRetakeQuiz: () => void;
  onBackToOverview: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  percentage,
  wrongAnswers,
  onReviewWrong,
  onRetakeQuiz,
  onBackToOverview,
}) => {
  const incorrectCount = totalQuestions - score;
  const isHighScorer = percentage >= 70;

  useEffect(() => {
    if (isHighScorer) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6C4FF6', '#4F8CFF', '#10B981', '#F59E0B'],
        });
      } catch (err) {
        // Safe if canvas-confetti has DOM issues
      }
    }
  }, [isHighScorer]);

  let feedbackMessage = 'Keep practicing to master these concepts!';
  if (percentage === 100) {
    feedbackMessage = 'Flawless score! You have completely mastered this material.';
  } else if (percentage >= 80) {
    feedbackMessage = 'Great job! You have a solid grasp of these core concepts.';
  } else if (percentage >= 60) {
    feedbackMessage = 'Good effort! Review the questions you missed to reinforce your memory.';
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        className="prepai-card"
        style={{
          padding: '40px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Trophy / Score Ring Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isHighScorer
              ? 'linear-gradient(135deg, var(--primary-light) 0%, #FFFFFF 100%)'
              : 'var(--bg-app)',
            border: `2px solid ${isHighScorer ? 'var(--primary-border)' : 'var(--border-color)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isHighScorer ? 'var(--primary)' : 'var(--text-muted)',
            marginBottom: '20px',
          }}
        >
          <Trophy size={40} />
        </div>

        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--primary)',
            marginBottom: '6px',
          }}
        >
          Quiz Completed
        </span>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
          Your Results
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5, marginBottom: '32px' }}>
          {feedbackMessage}
        </p>

        {/* 3 Metrics Cards */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          {/* Total Score */}
          <div
            style={{
              padding: '16px 12px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Final Score
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {score} <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 500 }}>/ {totalQuestions}</span>
            </div>
          </div>

          {/* Correct */}
          <div
            style={{
              padding: '16px 12px',
              backgroundColor: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-text)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} />
              <span>Correct</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success-text)' }}>
              {score}
            </div>
          </div>

          {/* Incorrect */}
          <div
            style={{
              padding: '16px 12px',
              backgroundColor: incorrectCount > 0 ? 'var(--error-bg)' : 'var(--bg-app)',
              border: `1px solid ${incorrectCount > 0 ? 'var(--error-border)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: incorrectCount > 0 ? 'var(--error-text)' : 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <XCircle size={13} />
              <span>Incorrect</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: incorrectCount > 0 ? 'var(--error-text)' : 'var(--text-main)' }}>
              {incorrectCount}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {wrongAnswers.length > 0 && (
            <button
              onClick={onReviewWrong}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <AlertCircle size={18} />
              <span>Review Wrong Answers ({wrongAnswers.length})</span>
            </button>
          )}

          <button
            onClick={onRetakeQuiz}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            <RotateCcw size={16} />
            <span>Retake Full Quiz</span>
          </button>

          <button
            onClick={onBackToOverview}
            className="btn btn-ghost"
            style={{ width: '100%' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Study Set Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
