import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  Bookmark, 
  Plus, 
  Trash2, 
  BookmarkCheck, 
  Layers, 
  CheckSquare, 
  Calendar, 
  Search,
  ArrowRight
} from 'lucide-react';
import { StudySetRecord } from '../types/study';
import { EmptyState } from '../components/states/EmptyState';

interface HistoryProps {
  records: StudySetRecord[];
  isFavoritesOnly?: boolean;
  onOpenRecord: (record: StudySetRecord) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onNewSet: () => void;
}

export const History: React.FC<HistoryProps> = ({
  records,
  isFavoritesOnly = false,
  onOpenRecord,
  onToggleFavorite,
  onDeleteRecord,
  onNewSet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records
    .filter((r) => (isFavoritesOnly ? r.isFavorite : true))
    .filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.keyConcepts && r.keyConcepts.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())))
    );

  const title = isFavoritesOnly ? 'Saved Favorites' : 'Study Set History';
  const description = isFavoritesOnly
    ? 'Access your bookmarked study sets anytime for quick review.'
    : 'Previously generated decks stored locally in your browser.';

  if (records.length === 0 || (isFavoritesOnly && filteredRecords.length === 0 && !searchTerm)) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <EmptyState
          icon={isFavoritesOnly ? Bookmark : HistoryIcon}
          title={isFavoritesOnly ? 'No Favorites Yet' : 'No Study Sets Yet'}
          description={
            isFavoritesOnly
              ? 'Star study sets to keep your most important decks easily accessible here.'
              : 'Generate your first interactive study set from any notes or topic.'
          }
          actionLabel="+ Create Study Set"
          onAction={onNewSet}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>
            {title}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {description}
          </p>
        </div>

        <button onClick={onNewSet} className="btn btn-primary">
          <Plus size={16} />
          <span>New Study Set</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search
          size={16}
          color="var(--text-light)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by topic, summary or keywords..."
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            fontSize: '0.875rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF',
            outline: 'none',
          }}
        />
      </div>

      {/* List of Cards */}
      {filteredRecords.length === 0 ? (
        <div className="prepai-card" style={{ padding: '36px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No study sets matched your search "{searchTerm}".
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredRecords.map((record) => {
            const dateFormatted = new Date(record.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={record.id}
                className="prepai-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  {/* Card Badges and Top Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span className={`badge badge-${record.difficulty}`}>
                      {record.difficulty}
                    </span>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => onToggleFavorite(record.id)}
                        style={{
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)',
                          color: record.isFavorite ? 'var(--primary)' : 'var(--text-light)',
                          backgroundColor: record.isFavorite ? 'var(--primary-light)' : 'transparent',
                        }}
                        title={record.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {record.isFavorite ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete study set "${record.title}"?`)) {
                            onDeleteRecord(record.id);
                          }
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-light)',
                        }}
                        title="Delete study set"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenRecord(record)}
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      marginBottom: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {record.title}
                  </h3>

                  {/* Summary */}
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '12px',
                    }}
                  >
                    {record.summary}
                  </p>

                  {/* Key Concepts Tags */}
                  {record.keyConcepts && record.keyConcepts.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {record.keyConcepts.slice(0, 3).map((concept, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--bg-app)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem',
                    color: 'var(--text-light)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {record.data.flashcards.length > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Layers size={13} color="var(--primary)" />
                        {record.data.flashcards.length}
                      </span>
                    )}
                    {record.data.quiz.length > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckSquare size={13} color="var(--secondary)" />
                        {record.data.quiz.length}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {dateFormatted}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenRecord(record)}
                    className="btn btn-subtle btn-sm"
                  >
                    <span>Study</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
