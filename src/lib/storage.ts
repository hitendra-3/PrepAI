import { StudySetRecord, StudySetData, GenerationMode, Difficulty } from '../types/study';

const STORAGE_KEY = 'prepai_study_sets_v1';

export function getStoredStudySets(): StudySetRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load study sets from localStorage:', error);
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
    console.error('Failed to update favorite:', error);
  }
  return updated;
}

export function deleteStudySetFromStorage(id: string): StudySetRecord[] {
  const records = getStoredStudySets();
  const updated = records.filter((rec) => rec.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete study set:', error);
  }
  return updated;
}

export function getStudySetById(id: string): StudySetRecord | undefined {
  const records = getStoredStudySets();
  return records.find((rec) => rec.id === id);
}
