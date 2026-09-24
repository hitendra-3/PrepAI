import React from 'react';
import { RotateCw, Lightbulb, Star, HelpCircle, CheckCircle2 } from 'lucide-react';
import { FlashcardItem } from '../../types/study';

interface FlashcardProps {
  card: FlashcardItem;
  isFlipped: boolean;
  onFlip: () => void;
  isMarkedForReview: boolean;
  onToggleReview: (id: string) => void;
  index: number;
  total: number;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  isMarkedForReview,
  onToggleReview,
  index,
  total,
}) => {
  return (
    <div className="flashcard-scene">
      <div
        className={`flashcard-card ${isFlipped ? 'is-flipped' : ''}`}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label="Toggle flashcard side"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        {/* FRONT FACE: Question */}
        <div className="flashcard-face flashcard-front">
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <HelpCircle size={13} />
              <span>Question {index + 1} of {total}</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleReview(card.id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isMarkedForReview ? '#FEF3C7' : 'var(--bg-app)',
                color: isMarkedForReview ? '#D97706' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: isMarkedForReview ? '1px solid #FDE68A' : '1px solid var(--border-color)',
                transition: 'all 0.15s ease',
              }}
              title={isMarkedForReview ? 'Unmark review' : 'Mark for review'}
            >
              <Star size={13} fill={isMarkedForReview ? '#D97706' : 'none'} />
              <span>{isMarkedForReview ? 'Marked' : 'Review'}</span>
            </button>
          </div>

          {/* Question Text */}
          <div style={{ margin: 'auto 0', padding: '24px 0', minHeight: '140px', display: 'flex', alignItems: 'center' }}>
            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                lineHeight: 1.5,
                color: 'var(--text-main)',
              }}
            >
              {card.question}
            </h3>
          </div>

          {/* Bottom Flip Prompt */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.775rem',
              color: 'var(--text-light)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
            }}
          >
            <RotateCw size={13} />
            <span>Click card or press <kbd style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1px 5px', borderRadius: '4px' }}>Space</kbd> to reveal answer</span>
          </div>
        </div>

        {/* BACK FACE: Answer & Key Takeaway */}
        <div className="flashcard-face flashcard-back">
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--success-text)',
                backgroundColor: 'var(--success-bg)',
                border: '1px solid var(--success-border)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <CheckCircle2 size={13} />
              <span>Answer & Key Takeaway</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleReview(card.id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isMarkedForReview ? '#FEF3C7' : 'var(--bg-app)',
                color: isMarkedForReview ? '#D97706' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: isMarkedForReview ? '1px solid #FDE68A' : '1px solid var(--border-color)',
                transition: 'all 0.15s ease',
              }}
            >
              <Star size={13} fill={isMarkedForReview ? '#D97706' : 'none'} />
              <span>{isMarkedForReview ? 'Marked' : 'Review'}</span>
            </button>
          </div>

          {/* Answer Content */}
          <div style={{ margin: 'auto 0', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                fontWeight: 500,
              }}
            >
              {card.answer}
            </p>

            {card.keyPoint && (
              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <Lightbulb size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Key Takeaway
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>
                    {card.keyPoint}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Flip Prompt */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.775rem',
              color: 'var(--text-light)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
            }}
          >
            <RotateCw size={13} />
            <span>Click to flip back to question</span>
          </div>
        </div>
      </div>
    </div>
  );
};
