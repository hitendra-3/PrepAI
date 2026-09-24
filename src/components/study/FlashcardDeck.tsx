import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Shuffle, 
  Star
} from 'lucide-react';
import { FlashcardItem } from '../../types/study';
import { Flashcard } from './Flashcard';

interface FlashcardDeckProps {
  cards: FlashcardItem[];
  deckTitle: string;
  onBack: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards: initialCards,
  deckTitle,
  onBack,
}) => {
  const [cards, setCards] = useState<FlashcardItem[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewCardIds, setReviewCardIds] = useState<Set<string>>(new Set());
  const [filterReviewOnly, setFilterReviewOnly] = useState(false);

  const activeDeck = filterReviewOnly
    ? cards.filter((c) => reviewCardIds.has(c.id))
    : cards;

  const currentCard = activeDeck[currentIndex] || activeDeck[0];
  const total = activeDeck.length;

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, total]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleToggleReview = useCallback((id: string) => {
    setReviewCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyN') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyP') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'Space' || e.code === 'KeyF') {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFlip]);

  if (total === 0) {
    return (
      <div className="prepai-card animate-fade-in" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '580px', margin: '0 auto' }}>
        <Star size={36} color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
          No cards marked for review
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          You haven't starred any cards in this deck yet.
        </p>
        <button onClick={() => setFilterReviewOnly(false)} className="btn btn-primary">
          View All Cards ({cards.length})
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="animate-fade-in flashcard-deck-container">
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} />
          <span>Back to Overview</span>
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleShuffle}
            className="btn btn-secondary btn-sm"
            title="Shuffle deck order"
          >
            <Shuffle size={14} />
            <span>Shuffle</span>
          </button>

          {reviewCardIds.size > 0 && (
            <button
              onClick={() => {
                setFilterReviewOnly(!filterReviewOnly);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`btn btn-sm ${filterReviewOnly ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Star size={13} />
              <span>{filterReviewOnly ? 'All Cards' : `Review (${reviewCardIds.size})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Counter */}
      <div style={{ padding: '2px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {deckTitle}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
            Card {currentIndex + 1} of {total} ({progressPercent}%)
          </span>
        </div>
        <div style={{ height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: 'var(--primary)',
              transition: 'width 0.25s ease',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>

      {/* Clean Flashcard */}
      {currentCard && (
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          isMarkedForReview={reviewCardIds.has(currentCard.id)}
          onToggleReview={handleToggleReview}
          index={currentIndex}
          total={total}
        />
      )}

      {/* Bottom Action Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr 1fr',
          gap: '12px',
          marginTop: '6px',
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn btn-secondary"
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>

        <button
          onClick={handleFlip}
          className="btn btn-subtle"
          style={{ fontWeight: 700 }}
        >
          <RotateCw size={15} />
          <span>{isFlipped ? 'Show Question' : 'Flip Card'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className="btn btn-primary"
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Keyboard Helper Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '0.75rem',
          color: 'var(--text-light)',
          marginTop: '4px',
          flexWrap: 'wrap',
        }}
      >
        <span><kbd style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1px 5px', borderRadius: '4px' }}>←</kbd> Prev</span>
        <span><kbd style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1px 5px', borderRadius: '4px' }}>Space</kbd> Flip</span>
        <span><kbd style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '1px 5px', borderRadius: '4px' }}>→</kbd> Next</span>
      </div>
    </div>
  );
};
