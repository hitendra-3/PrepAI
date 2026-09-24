import React, { useState } from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { UserAnswerRecord } from '../../types/study';

interface WrongAnswerReviewProps {
  wrongAnswers: UserAnswerRecord[];
  onRetryWrong: () => void;
  onBackToResults: () => void;
}

export const WrongAnswerReview: React.FC<WrongAnswerReviewProps> = ({
  wrongAnswers,
  onRetryWrong,
  onBackToResults,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (wrongAnswers.length === 0) {
    return (
      <div className="prepai-card animate-fade-in" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <CheckCircle2 size={40} color="var(--success)" style={{ margin: '0 auto 16px auto' }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
          No Incorrect Answers!
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          You answered every question correctly in this session.
        </p>
        <button onClick={onBackToResults} className="btn btn-primary">
          Back to Results
        </button>
      </div>
    );
  }

  const currentItem = wrongAnswers[currentIndex];
  const total = wrongAnswers.length;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={onBackToResults} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Results</span>
        </button>

        <button onClick={onRetryWrong} className="btn btn-primary btn-sm">
          <RotateCcw size={14} />
          <span>Retry Wrong Answers ({wrongAnswers.length})</span>
        </button>
      </div>

      {/* Review Card */}
      <div className="prepai-card" style={{ padding: '32px' }}>
        {/* Counter Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--error-text)',
              backgroundColor: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            Reviewing Missed Question {currentIndex + 1} of {total}
          </span>
        </div>

        {/* Question */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '24px' }}>
          {currentItem.question}
        </h3>

        {/* Options with user's incorrect choice and the correct choice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {currentItem.options.map((option, idx) => {
            const isSelectedWrong = idx === currentItem.selectedAnswer;
            const isCorrect = idx === currentItem.correctAnswer;

            let bg = '#FFFFFF';
            let border = 'var(--border-color)';
            let textColor = 'var(--text-main)';

            if (isSelectedWrong) {
              bg = 'var(--error-bg)';
              border = 'var(--error)';
              textColor = 'var(--error-text)';
            } else if (isCorrect) {
              bg = 'var(--success-bg)';
              border = 'var(--success)';
              textColor = 'var(--success-text)';
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${border}`,
                  backgroundColor: bg,
                  color: textColor,
                  fontSize: '0.9rem',
                  fontWeight: isSelectedWrong || isCorrect ? 600 : 400,
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {isSelectedWrong ? (
                    <XCircle size={18} color="var(--error)" />
                  ) : isCorrect ? (
                    <CheckCircle2 size={18} color="var(--success)" />
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700 }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>{option}</div>

                {isSelectedWrong && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--error-text)' }}>
                    Your Answer
                  </span>
                )}
                {isCorrect && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--success-text)' }}>
                    Correct Answer
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
            <HelpCircle size={14} color="var(--primary)" />
            <span>AI Explanation</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {currentItem.explanation}
          </p>
        </div>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(total - 1, prev + 1))}
            disabled={currentIndex === total - 1}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
