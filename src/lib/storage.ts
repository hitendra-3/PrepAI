import { StudySetRecord, StudySetData, GenerationMode, Difficulty } from '../types/study';
import { validateResult } from './validateResult';

const STORAGE_KEY = 'prepai_study_sets_v1';

/**
 * Loads and validates study sets from localStorage to ensure corrupted data never crashes the UI
 */
export function getStoredStudySets(): StudySetRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Runtime validation of each stored record's data payload
    const validatedRecords: StudySetRecord[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== 'object' || !item.id || !item.title) continue;

      const validation = validateResult(item.data);
      if (validation.valid) {
        validatedRecords.push({
          id: String(item.id),
          title: item.title,
          summary: item.summary || validation.data.summary,
          keyConcepts: item.keyConcepts || validation.data.keyConcepts,
          mode: item.mode || 'both',
          difficulty: item.difficulty || 'medium',
          createdAt: item.createdAt || new Date().toISOString(),
          data: validation.data,
          isFavorite: Boolean(item.isFavorite),
        });
      }
    }

    return validatedRecords;
  } catch (error) {
    console.warn('Failed to parse study sets from localStorage:', error);
    return [];
  }
}

export function saveStudySetToStorage(
  data: StudySetData,
  mode: GenerationMode,
  difficulty: Difficulty
): StudySetRecord {
  const records = getStoredStudySets();
  const id = `set-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  const newRecord: StudySetRecord = {
    id,
    title: data.title,
    summary: data.summary,
    keyConcepts: data.keyConcepts,
    mode,
    difficulty,
    createdAt: new Date().toISOString(),
    data,
    isFavorite: false,
  };

  const updated = [newRecord, ...records];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save study set to localStorage:', error);
  }

  return newRecord;
}

export function toggleFavoriteInStorage(id: string): StudySetRecord[] {
  const records = getStoredStudySets();
  const updated = records.map((rec) =>
    rec.id === id ? { ...rec, isFavorite: !rec.isFavorite } : rec
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update favorite in localStorage:', error);
  }
  return updated;
}

export function deleteStudySetFromStorage(id: string): StudySetRecord[] {
  const records = getStoredStudySets();
  const updated = records.filter((rec) => rec.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete study set from localStorage:', error);
  }
  return updated;
}

export function getStudySetById(id: string): StudySetRecord | undefined {
  const records = getStoredStudySets();
  return records.find((rec) => rec.id === id);
}
