import React from 'react';
import { Layers, CheckSquare, Sparkles, Zap, SlidersHorizontal } from 'lucide-react';
import { GenerationMode, Difficulty } from '../../types/study';

interface GenerationOptionsProps {
  mode: GenerationMode;
  onChangeMode: (mode: GenerationMode) => void;
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  count: number;
  onChangeCount: (count: number) => void;
}

export const GenerationOptions: React.FC<GenerationOptionsProps> = ({
  mode,
  onChangeMode,
  difficulty,
  onChangeDifficulty,
  count,
  onChangeCount,
}) => {
  const modes: { id: GenerationMode; label: string; icon: any; desc: string }[] = [
    { id: 'both', label: 'Flashcards & Quiz', icon: Sparkles, desc: 'Complete interactive study deck' },
    { id: 'flashcards', label: 'Flashcards Only', icon: Layers, desc: 'Quick flip & active recall practice' },
    { id: 'quiz', label: 'Quiz Only', icon: CheckSquare, desc: 'Multiple-choice test with scoring' },
  ];

  const difficulties: { id: Difficulty; label: string; tag: string }[] = [
    { id: 'easy', label: 'Easy', tag: 'Foundational' },
    { id: 'medium', label: 'Medium', tag: 'Practical' },
    { id: 'hard', label: 'Hard', tag: 'Advanced' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
      }}
    >
      {/* Left Column: Generation Mode */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Layers size={14} />
          </div>
          <span>Generation Mode</span>
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeMode(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 0 1px var(--primary)' : 'var(--shadow-xs)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-app)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.label}</div>
                  <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', marginTop: '1px' }}>
                    {m.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Difficulty & Item Count */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Difficulty */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Zap size={14} />
            </div>
            <span>Target Difficulty</span>
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {difficulties.map((d) => {
              const isSelected = difficulty === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChangeDifficulty(d.id)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 0 1px var(--primary)' : 'var(--shadow-xs)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{d.label}</div>
                  <div style={{ fontSize: '0.7rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', marginTop: '2px' }}>
                    {d.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Number of Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <SlidersHorizontal size={14} />
              </div>
              <span>Number of Items</span>
            </label>

            <span
              style={{
                fontSize: '0.825rem',
                fontWeight: 800,
                color: 'var(--primary)',
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {count} items
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>5</span>
              <input
                type="range"
                min={5}
                max={20}
                step={1}
                value={count}
                onChange={(e) => onChangeCount(parseInt(e.target.value, 10))}
                style={{
                  flex: 1,
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>20</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {[5, 10, 15, 20].map((presetCount) => (
                <button
                  key={presetCount}
                  type="button"
                  onClick={() => onChangeCount(presetCount)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: count === presetCount ? 'var(--primary)' : '#FFFFFF',
                    color: count === presetCount ? '#FFFFFF' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {presetCount}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
