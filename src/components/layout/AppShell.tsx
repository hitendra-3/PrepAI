import React from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
  favoritesCount: number;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  favoritesCount,
  children,
}) => {
  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        savedCount={savedCount}
        favoritesCount={favoritesCount}
      />
      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          savedCount={savedCount}
          favoritesCount={favoritesCount}
        />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};
