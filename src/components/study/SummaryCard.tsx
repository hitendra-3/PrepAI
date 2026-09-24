import React from 'react';
import { BookOpen, Tag, Calendar, Layers, CheckSquare } from 'lucide-react';
import { StudySetRecord } from '../../types/study';

interface SummaryCardProps {
  record: StudySetRecord;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ record }) => {
  const { data, difficulty, createdAt } = record;
  const dateFormatted = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="prepai-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '22px', backgroundColor: '#FFFFFF' }}>
      {/* Overview Top Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
            {data.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`badge badge-${difficulty}`}>{difficulty} difficulty</span>
            {data.flashcards.length > 0 && (
              <span className="badge badge-primary">
                <Layers size={12} /> {data.flashcards.length} Flashcards
              </span>
            )}
            {data.quiz.length > 0 && (
              <span className="badge badge-primary">
                <CheckSquare size={12} /> {data.quiz.length} Quiz Questions
              </span>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} /> {dateFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div
        style={{
          backgroundColor: 'var(--bg-app)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          <BookOpen size={13} color="var(--primary)" />
          <span>Quick Summary</span>
        </div>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.65 }}>
          {data.summary}
        </p>
      </div>

      {/* Key Concepts */}
      {data.keyConcepts && data.keyConcepts.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
            <Tag size={13} color="var(--secondary)" />
            <span>Key Concepts</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {data.keyConcepts.map((concept, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
