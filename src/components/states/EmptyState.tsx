import React from 'react';
import { PlusCircle, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: any;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = BookOpen,
  title,
  description,
  actionLabel = '+ New Study Set',
  onAction,
}) => {
  return (
    <div
      className="prepai-card animate-fade-in"
      style={{
        padding: '56px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: '24px',
        }}
      >
        {description}
      </p>

      {onAction && (
        <button onClick={onAction} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
