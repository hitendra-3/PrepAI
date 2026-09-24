import React from 'react';
import { Sparkles, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { LoadingStep } from '../../hooks/useStudySet';

interface LoadingStateProps {
  steps: LoadingStep[];
}

export const LoadingState: React.FC<LoadingStateProps> = ({ steps }) => {
  return (
    <div
      className="prepai-card animate-fade-in"
      style={{
        maxWidth: '560px',
        margin: '40px auto',
        padding: '48px 36px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Animated Glowing Icon */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--primary-light) 0%, #FFFFFF 100%)',
          border: '1.5px solid var(--primary-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: '24px',
          boxShadow: '0 8px 20px rgba(108, 79, 246, 0.15)',
        }}
        className="pulse-primary"
      >
        <Sparkles size={36} />
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
        Creating your study set...
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px' }}>
        Analyzing your input and generating structured, verified flashcards and quizzes.
      </p>

      {/* Progress Checklist Steps */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'left',
          backgroundColor: 'var(--bg-app)',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
        }}
      >
        {steps.map((step) => {
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.9rem',
                color: isCompleted
                  ? 'var(--success-text)'
                  : isInProgress
                  ? 'var(--primary)'
                  : 'var(--text-light)',
                fontWeight: isCompleted || isInProgress ? 600 : 400,
                transition: 'all 0.3s ease',
              }}
            >
              {isCompleted ? (
                <CheckCircle2 size={20} color="var(--success)" style={{ flexShrink: 0 }} />
              ) : isInProgress ? (
                <Loader2
                  size={20}
                  color="var(--primary)"
                  style={{
                    flexShrink: 0,
                    animation: 'spin 1.2s linear infinite',
                  }}
                />
              ) : (
                <Circle size={20} color="var(--border-color)" style={{ flexShrink: 0 }} />
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
