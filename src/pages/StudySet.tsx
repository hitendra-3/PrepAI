import React, { useState } from 'react';
import { StudySetRecord } from '../types/study';
import { StudyOverview } from '../components/study/StudyOverview';
import { FlashcardDeck } from '../components/study/FlashcardDeck';
import { QuizView } from '../components/study/QuizView';

interface StudySetProps {
  record: StudySetRecord;
  onToggleFavorite: (id: string) => void;
  onNewSet: () => void;
}

type ActiveView = 'overview' | 'flashcards' | 'quiz';

export const StudySet: React.FC<StudySetProps> = ({
  record,
  onToggleFavorite,
  onNewSet,
}) => {
  const [activeView, setActiveView] = useState<ActiveView>('overview');

  if (activeView === 'flashcards') {
    return (
      <FlashcardDeck
        cards={record.data.flashcards}
        deckTitle={record.title}
        onBack={() => setActiveView('overview')}
      />
    );
  }

  if (activeView === 'quiz') {
    return (
      <QuizView
        questions={record.data.quiz}
        quizTitle={record.title}
        onBack={() => setActiveView('overview')}
      />
    );
  }

  return (
    <StudyOverview
      record={record}
      onStartFlashcards={() => setActiveView('flashcards')}
      onStartQuiz={() => setActiveView('quiz')}
      onToggleFavorite={onToggleFavorite}
      onNewSet={onNewSet}
    />
  );
};
