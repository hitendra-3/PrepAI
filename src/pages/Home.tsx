import React from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckSquare, 
  RotateCcw, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { StudySetRecord } from '../types/study';

interface HomeProps {
  onStartCreate: () => void;
  recentSets: StudySetRecord[];
  onOpenSet: (record: StudySetRecord) => void;
}

export const Home: React.FC<HomeProps> = ({
  onStartCreate,
  recentSets,
  onOpenSet,
}) => {
  const featureCards = [
    {
      icon: Layers,
      title: 'Interactive Flashcards',
      description: 'Master key definitions, core mechanisms, and mnemonic takeaways with smooth 3D flip cards and keyboard controls.',
      badge: 'Active Recall',
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
    },
    {
      icon: CheckSquare,
      title: 'Rigorous Quizzes',
      description: 'Test your understanding with 4-choice questions, instant correctness validation, and in-depth educational explanations.',
      badge: 'Assessment',
      color: 'var(--secondary)',
      bg: 'var(--secondary-light)',
    },
    {
      icon: RotateCcw,
      title: 'Smart Wrong-Answer Retry',
      description: 'Review only the questions you missed and immediately retry them without wasting tokens or waiting for new API calls.',
      badge: 'Targeted Review',
      color: '#059669',
      bg: '#ECFDF5',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '40px 16px 24px 16px',
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '20px',
            border: '1px solid var(--primary-border)',
          }}
        >
          <Sparkles size={14} />
          <span>Turn your notes into active learning</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.035em',
            marginBottom: '16px',
            color: 'var(--text-main)',
          }}
        >
          Transform raw notes into{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            active study sets
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '560px',
            marginBottom: '28px',
          }}
        >
          Generate interactive flashcards and quizzes from any topic or study notes in seconds with structured AI.
        </p>

        <button
          onClick={onStartCreate}
          className="btn btn-primary btn-lg"
          style={{ padding: '14px 28px', fontSize: '1.05rem', boxShadow: '0 6px 20px rgba(108, 79, 246, 0.25)' }}
        >
          <span>Create Study Set</span>
          <ArrowRight size={18} />
        </button>
      </section>

      {/* 3 Feature Cards */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {featureCards.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="prepai-card"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: feat.bg,
                    color: feat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} />
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: feat.color,
                    backgroundColor: feat.bg,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {feat.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px' }}>
                {feat.title}
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {feat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Recent Study Sets Section */}
      {recentSets.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Study Sets</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {recentSets.length} saved in browser
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {recentSets.slice(0, 4).map((record) => (
              <div
                key={record.id}
                className="prepai-card"
                onClick={() => onOpenSet(record)}
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{record.title}</h4>
                    <span className={`badge badge-${record.difficulty}`}>{record.difficulty}</span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {record.summary}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-light)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '10px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {record.data.flashcards.length > 0 && (
                      <span>{record.data.flashcards.length} Cards</span>
                    )}
                    {record.data.quiz.length > 0 && (
                      <span>{record.data.quiz.length} Questions</span>
                    )}
                  </div>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Open Deck →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
