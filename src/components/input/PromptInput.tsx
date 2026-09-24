import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

const PRESET_EXAMPLES = [
  {
    label: 'React Hooks Mastery',
    text: 'Explain React Hooks for a frontend interview: useState, useEffect, useContext, useReducer, and useMemo with real-world examples and common pitfalls.',
  },
  {
    label: 'System Design: Caching',
    text: 'Explain caching strategies in distributed systems: Redis, LRU cache eviction, Cache-Aside vs Write-Through, cache stampede mitigation, and TTL policies.',
  },
  {
    label: 'Database Indexing & SQL',
    text: 'Explain B-Tree vs Hash indexes in relational databases, composite indexes, query execution plans, and N+1 query performance optimization.',
  },
  {
    label: 'JavaScript Event Loop',
    text: 'Explain the JavaScript runtime event loop: call stack, web APIs, microtask queue (Promises), macrotask queue (setTimeout), and execution order.',
  },
];

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  maxLength = 10000,
}) => {
  const currentLength = value.length;
  const isNearLimit = currentLength > maxLength * 0.9;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Field Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label
          htmlFor="prompt-input"
          style={{
            fontSize: '0.925rem',
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
            <FileText size={14} />
          </div>
          <span>Study Topic or Raw Notes</span>
        </label>
      </div>

      {/* Quick Presets Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-app)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginRight: '2px',
          }}
        >
          <Sparkles size={12} color="var(--primary)" />
          Try Presets:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
          {PRESET_EXAMPLES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.text)}
              style={{
                fontSize: '0.775rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                boxShadow: 'var(--shadow-xs)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-border)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Box */}
      <div style={{ position: 'relative' }}>
        <textarea
          id="prompt-input"
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={`Example:
Explain React Hooks for a software developer interview. Include useState, useEffect, useContext and useReducer with examples and common mistakes.`}
          style={{
            width: '100%',
            padding: '16px 16px 36px 16px',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF',
            color: 'var(--text-main)',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: 'var(--shadow-xs)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.boxShadow = 'var(--shadow-xs)';
          }}
        />

        {/* Character Counter */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '14px',
            fontSize: '0.725rem',
            fontWeight: 600,
            color: isNearLimit ? 'var(--error)' : 'var(--text-light)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          {currentLength.toLocaleString()} / {maxLength.toLocaleString()} chars
        </div>
      </div>
    </div>
  );
};
