import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { GenerationMode, Difficulty, StudySetRecord } from '../types/study';
import { PromptInput } from '../components/input/PromptInput';
import { GenerationOptions } from '../components/input/GenerationOptions';
import { GenerateButton } from '../components/input/GenerateButton';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { useStudySet } from '../hooks/useStudySet';

interface CreateStudySetProps {
  onSuccess: (record: StudySetRecord) => void;
  onCancel?: () => void;
}

export const CreateStudySet: React.FC<CreateStudySetProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<GenerationMode>('both');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [count, setCount] = useState<number>(10);
  const [clientError, setClientError] = useState<string | null>(null);

  const {
    loading,
    error,
    loadingSteps,
    generate,
    resetState,
    setError,
  } = useStudySet();

  const handleGenerate = async () => {
    // Client-side validation
    if (!input.trim()) {
      setClientError('Please enter a topic or paste your study notes.');
      return;
    }

    if (input.trim().length < 5) {
      setClientError('Input is too brief. Please enter at least a short sentence or topic description.');
      return;
    }

    setClientError(null);

    const record = await generate({
      input: input.trim(),
      mode,
      difficulty,
      count,
    });

    if (record) {
      onSuccess(record);
    }
  };

  if (loading) {
    return <LoadingState steps={loadingSteps} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to generate study material"
        message={error}
        onRetry={handleGenerate}
        onBack={resetState}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--primary)',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '10px',
          }}
        >
          <Sparkles size={12} />
          <span>AI Material Generator</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>
          What do you want to learn?
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Paste your notes or enter any topic and we'll transform them into an interactive study set.
        </p>
      </div>

      {/* Main Creation Card */}
      <div
        className="prepai-card"
        style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Client Error Banner */}
        {clientError && (
          <div
            style={{
              backgroundColor: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--error-text)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{clientError}</span>
          </div>
        )}

        {/* 1. Prompt Input with Presets */}
        <PromptInput
          value={input}
          onChange={(val) => {
            setInput(val);
            if (clientError) setClientError(null);
          }}
        />

        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0 -4px' }} />

        {/* 2. Generation Options */}
        <GenerationOptions
          mode={mode}
          onChangeMode={setMode}
          difficulty={difficulty}
          onChangeDifficulty={setDifficulty}
          count={count}
          onChangeCount={setCount}
        />

        {/* 3. Primary Synthesis Button */}
        <div style={{ paddingTop: '4px' }}>
          <GenerateButton
            loading={loading}
            onClick={handleGenerate}
            label="Generate Study Material ✦"
          />
        </div>
      </div>
    </div>
  );
};
