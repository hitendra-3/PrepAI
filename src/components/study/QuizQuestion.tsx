import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { QuizQuestionItem } from '../../types/study';

interface QuizQuestionProps {
  question: QuizQuestionItem;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isSubmitted: boolean;
  onSubmit: () => void;
  onNext: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isSubmitted,
  onSubmit,
  onNext,
}) => {
  const isLastQuestion = questionNumber === totalQuestions;
  const isUserCorrect = isSubmitted && selectedOption === question.correctAnswer;

  return (
    <div
      className="prepai-card animate-fade-in"
      style={{
        padding: '36px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Top Question Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--secondary)',
            backgroundColor: 'var(--secondary-light)',
            border: '1px solid var(--secondary-border)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <HelpCircle size={13} />
          <span>Question {questionNumber} of {totalQuestions}</span>
        </span>
      </div>

      {/* Question Text */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          lineHeight: 1.5,
        }}
      >
        {question.question}
      </h3>

      {/* Answer Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = isSubmitted && index === question.correctAnswer;
          const isWrong = isSubmitted && isSelected && index !== question.correctAnswer;

          let optionBg = '#FFFFFF';
          let optionBorder = 'var(--border-color)';
          let optionTextColor = 'var(--text-main)';
          let badgeBg = 'var(--bg-app)';
          let badgeColor = 'var(--text-muted)';

          if (!isSubmitted) {
            if (isSelected) {
              optionBg = 'var(--primary-light)';
              optionBorder = 'var(--primary)';
              optionTextColor = 'var(--primary)';
              badgeBg = 'var(--primary)';
              badgeColor = '#FFFFFF';
            }
          } else {
            if (isCorrect) {
              optionBg = 'var(--success-bg)';
              optionBorder = 'var(--success)';
              optionTextColor = 'var(--success-text)';
              badgeBg = 'var(--success)';
              badgeColor = '#FFFFFF';
            } else if (isWrong) {
              optionBg = 'var(--error-bg)';
              optionBorder = 'var(--error)';
              optionTextColor = 'var(--error-text)';
              badgeBg = 'var(--error)';
              badgeColor = '#FFFFFF';
            } else if (isSelected) {
              optionBg = 'var(--bg-app)';
            }
          }

          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <button
              key={index}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelectOption(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${optionBorder}`,
                backgroundColor: optionBg,
                color: optionTextColor,
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isSelected && !isSubmitted ? '0 0 0 1px var(--primary)' : 'var(--shadow-xs)',
                cursor: isSubmitted ? 'default' : 'pointer',
              }}
            >
              {/* Option Letter Tag / Result Icon */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: badgeBg,
                  color: badgeColor,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                {isSubmitted && isCorrect ? (
                  <CheckCircle2 size={16} />
                ) : isSubmitted && isWrong ? (
                  <XCircle size={16} />
                ) : (
                  optionLetter
                )}
              </div>

              {/* Option Text */}
              <div style={{ flex: 1, fontSize: '0.925rem', fontWeight: isSelected || isCorrect ? 600 : 500, lineHeight: 1.4 }}>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Box (Revealed after submission) */}
      {isSubmitted && (
        <div
          className="animate-fade-in"
          style={{
            backgroundColor: isUserCorrect ? 'var(--success-bg)' : 'var(--error-bg)',
            border: `1px solid ${isUserCorrect ? 'var(--success-border)' : 'var(--error-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.775rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: isUserCorrect ? 'var(--success-text)' : 'var(--error-text)',
            }}
          >
            {isUserCorrect ? (
              <>
                <CheckCircle2 size={15} />
                <span>Correct Answer</span>
              </>
            ) : (
              <>
                <XCircle size={15} />
                <span>Incorrect Answer</span>
              </>
            )}
          </div>
          <p style={{ fontSize: '0.8875rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div style={{ paddingTop: '6px' }}>
        {!isSubmitted ? (
          <button
            onClick={onSubmit}
            disabled={selectedOption === null}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px' }}
          >
            <span>Submit Answer</span>
          </button>
        ) : (
          <button
            onClick={onNext}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', justifyContent: 'center' }}
          >
            <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
