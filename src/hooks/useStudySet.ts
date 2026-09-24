import { useState, useRef, useCallback } from 'react';
import { GenerateRequest, StudySetRecord, StudySetData } from '../types/study';
import { generateStudySetApi } from '../lib/api';
import { saveStudySetToStorage } from '../lib/storage';

export interface LoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const DEFAULT_STEPS: LoadingStep[] = [
  { id: '1', label: 'Understanding your topic & study notes', status: 'pending' },
  { id: '2', label: 'Generating structured learning hierarchy', status: 'pending' },
  { id: '3', label: 'Synthesizing interactive flashcard deck', status: 'pending' },
  { id: '4', label: 'Formulating multiple-choice quiz questions & explanations', status: 'pending' },
];

export function useStudySet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRecord, setCurrentRecord] = useState<StudySetRecord | null>(null);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(DEFAULT_STEPS);
  
  // Stale request protection
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout[]>([]);

  const clearStepTimers = () => {
    stepTimerRef.current.forEach((t) => clearTimeout(t));
    stepTimerRef.current = [];
  };

  const startStepAnimation = () => {
    clearStepTimers();
    setLoadingSteps([
      { id: '1', label: 'Understanding your topic & study notes', status: 'in_progress' },
      { id: '2', label: 'Generating structured learning hierarchy', status: 'pending' },
      { id: '3', label: 'Synthesizing interactive flashcard deck', status: 'pending' },
      { id: '4', label: 'Formulating multiple-choice quiz questions & explanations', status: 'pending' },
    ]);

    // Animate steps realistically
    const t1 = setTimeout(() => {
      setLoadingSteps((prev) =>
        prev.map((s, idx) =>
          idx === 0
            ? { ...s, status: 'completed' }
            : idx === 1
            ? { ...s, status: 'in_progress' }
            : s
        )
      );
    }, 600);

    const t2 = setTimeout(() => {
      setLoadingSteps((prev) =>
        prev.map((s, idx) =>
          idx <= 1
            ? { ...s, status: 'completed' }
            : idx === 2
            ? { ...s, status: 'in_progress' }
            : s
        )
      );
    }, 1400);

    const t3 = setTimeout(() => {
      setLoadingSteps((prev) =>
        prev.map((s, idx) =>
          idx <= 2
            ? { ...s, status: 'completed' }
            : idx === 3
            ? { ...s, status: 'in_progress' }
            : s
        )
      );
    }, 2200);

    stepTimerRef.current = [t1, t2, t3];
  };

  const generate = useCallback(
    async (params: GenerateRequest): Promise<StudySetRecord | null> => {
      // Abort previous in-flight request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const currentId = ++requestIdRef.current;

      setLoading(true);
      setError(null);
      startStepAnimation();

      try {
        const validatedData: StudySetData = await generateStudySetApi(
          params,
          abortController.signal
        );

        // STALE RESPONSE CHECK: If a newer request was made, discard this result
        if (currentId !== requestIdRef.current) {
          console.warn(`Discarded stale response for request #${currentId}`);
          return null;
        }

        // Mark all steps as complete
        setLoadingSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));

        // Persist to localStorage
        const record = saveStudySetToStorage(validatedData, params.mode, params.difficulty);
        setCurrentRecord(record);
        setLoading(false);
        clearStepTimers();
        return record;
      } catch (err: any) {
        if (currentId !== requestIdRef.current) {
          // Stale error, ignore
          return null;
        }

        clearStepTimers();
        setLoading(false);
        const errorMessage = err?.message || 'An unexpected error occurred while generating study material.';
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  const loadRecord = useCallback((record: StudySetRecord) => {
    setError(null);
    setCurrentRecord(record);
  }, []);

  const resetState = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    clearStepTimers();
    setLoading(false);
    setError(null);
    setLoadingSteps(DEFAULT_STEPS);
  }, []);

  return {
    loading,
    error,
    currentRecord,
    loadingSteps,
    generate,
    loadRecord,
    setCurrentRecord,
    resetState,
    setError,
  };
}
