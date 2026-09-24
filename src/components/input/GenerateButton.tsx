import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  loading,
  disabled,
  onClick,
  label = 'Generate Study Material ✦',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="btn btn-primary btn-lg"
      style={{
        width: '100%',
        marginTop: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Synthesizing Study Set...</span>
        </>
      ) : (
        <>
          <Sparkles size={20} />
          <span>{label}</span>
        </>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
