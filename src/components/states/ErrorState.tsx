import React from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Generation Failed',
  message,
  onRetry,
  onBack,
}) => {
  return (
    <div
      className="prepai-card animate-fade-in"
      style={{
        maxWidth: '540px',
        margin: '40px auto',
        padding: '40px 32px',
        textAlign: 'center',
        border: '1px solid var(--error-border)',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: 'var(--error-bg)',
          border: '1px solid var(--error-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--error)',
          margin: '0 auto 20px auto',
        }}
      >
        <AlertTriangle size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          backgroundColor: 'var(--bg-app)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '28px',
          wordBreak: 'break-word',
        }}
      >
        {message}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {onBack && (
          <button onClick={onBack} className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        )}

        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary">
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};
