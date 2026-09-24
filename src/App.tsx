import React, { useState, useEffect } from 'react';
import { StudySetRecord } from './types/study';
import { 
  getStoredStudySets, 
  toggleFavoriteInStorage, 
  deleteStudySetFromStorage 
} from './lib/storage';
import { AppShell } from './components/layout/AppShell';
import { NavTab } from './components/layout/Sidebar';
import { Home } from './pages/Home';
import { CreateStudySet } from './pages/CreateStudySet';
import { StudySet } from './pages/StudySet';
import { History } from './pages/History';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [records, setRecords] = useState<StudySetRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<StudySetRecord | null>(null);

  // Load records from localStorage on initial render
  useEffect(() => {
    const saved = getStoredStudySets();
    setRecords(saved);
  }, []);

  const refreshRecords = () => {
    const saved = getStoredStudySets();
    setRecords(saved);
  };

  const handleCreateSuccess = (newRecord: StudySetRecord) => {
    refreshRecords();
    setCurrentRecord(newRecord);
    setActiveTab('study');
  };

  const handleOpenRecord = (record: StudySetRecord) => {
    setCurrentRecord(record);
    setActiveTab('study');
  };

  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteInStorage(id);
    setRecords(updated);
    if (currentRecord && currentRecord.id === id) {
      setCurrentRecord((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleDeleteRecord = (id: string) => {
    const updated = deleteStudySetFromStorage(id);
    setRecords(updated);
    if (currentRecord && currentRecord.id === id) {
      setCurrentRecord(null);
      setActiveTab('history');
    }
  };

  const savedCount = records.length;
  const favoritesCount = records.filter((r) => r.isFavorite).length;

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setActiveTab(tab);
        if (tab !== 'study') {
          // keep current record in memory if user wishes to resume
        }
      }}
      savedCount={savedCount}
      favoritesCount={favoritesCount}
    >
      {activeTab === 'home' && (
        <Home
          onStartCreate={() => setActiveTab('create')}
          recentSets={records}
          onOpenSet={handleOpenRecord}
        />
      )}

      {activeTab === 'create' && (
        <CreateStudySet
          onSuccess={handleCreateSuccess}
          onCancel={() => setActiveTab('home')}
        />
      )}

      {activeTab === 'study' && currentRecord && (
        <StudySet
          record={currentRecord}
          onToggleFavorite={handleToggleFavorite}
          onNewSet={() => setActiveTab('create')}
        />
      )}

      {activeTab === 'history' && (
        <History
          records={records}
          isFavoritesOnly={false}
          onOpenRecord={handleOpenRecord}
          onToggleFavorite={handleToggleFavorite}
          onDeleteRecord={handleDeleteRecord}
          onNewSet={() => setActiveTab('create')}
        />
      )}

      {activeTab === 'favorites' && (
        <History
          records={records}
          isFavoritesOnly={true}
          onOpenRecord={handleOpenRecord}
          onToggleFavorite={handleToggleFavorite}
          onDeleteRecord={handleDeleteRecord}
          onNewSet={() => setActiveTab('create')}
        />
      )}
    </AppShell>
  );
}

export default App;
