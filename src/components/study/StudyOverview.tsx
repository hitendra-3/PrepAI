import React from 'react';
import { 
  Layers, 
  CheckSquare, 
  ArrowRight, 
  Bookmark, 
  BookmarkCheck, 
  RotateCcw
} from 'lucide-react';
import { StudySetRecord } from '../../types/study';
import { SummaryCard } from './SummaryCard';

interface StudyOverviewProps {
  record: StudySetRecord;
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  onToggleFavorite: (id: string) => void;
  onNewSet: () => void;
}

export const StudyOverview: React.FC<StudyOverviewProps> = ({
  record,
  onStartFlashcards,
  onStartQuiz,
  onToggleFavorite,
  onNewSet,
}) => {
  const hasFlashcards = record.data.flashcards.length > 0;
  const hasQuiz = record.data.quiz.length > 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={onNewSet} className="btn btn-secondary btn-sm">
          <RotateCcw size={14} />
          <span>Create Another Set</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onToggleFavorite(record.id)}
            className={`btn btn-sm ${record.isFavorite ? 'btn-primary' : 'btn-secondary'}`}
            title="Save to favorites"
          >
            {record.isFavorite ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            <span>{record.isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </div>

      {/* Summary Card with Key Concepts */}
      <SummaryCard record={record} />

      {/* Interactive Mode Launch Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Flashcards Launch Card */}
        {hasFlashcards && (
          <div
            className="prepai-card"
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              border: '1px solid var(--primary-border)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <Layers size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                Interactive Flashcards
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Master key terms, definitions, and concepts through active 3D flip cards with keyboard shortcuts.
              </p>
            </div>

            <button
              onClick={onStartFlashcards}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Start Flashcards ({record.data.flashcards.length})</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Quiz Launch Card */}
        {hasQuiz && (
          <div
            className="prepai-card"
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              border: '1px solid #BFDBFE',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <CheckSquare size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                Multiple-Choice Quiz
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Test your mastery with instant feedback, comprehensive explanations, and in-memory wrong-answer retry.
              </p>
            </div>

            <button
              onClick={onStartQuiz}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                backgroundColor: 'var(--secondary)',
              }}
            >
              <span>Start Quiz ({record.data.quiz.length} Questions)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
