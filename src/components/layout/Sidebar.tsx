import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  PlusCircle, 
  History as HistoryIcon, 
  Bookmark, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export type NavTab = 'home' | 'create' | 'history' | 'favorites' | 'study';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
  favoritesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  favoritesCount,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: BookOpen },
    { id: 'create' as NavTab, label: 'New Study Set', icon: PlusCircle, badge: 'AI' },
    { id: 'history' as NavTab, label: 'History', icon: HistoryIcon, count: savedCount },
    { id: 'favorites' as NavTab, label: 'Favorites', icon: Bookmark, count: favoritesCount },
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
      className="hidden-mobile"
    >
      <div>
        {/* Brand Header */}
        <div
          onClick={() => onSelectTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            marginBottom: '28px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(108, 79, 246, 0.3)',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-main)',
                }}
              >
                PrepAI
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  letterSpacing: '0.02em',
                }}
              >
                v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Active Learning Assistant
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-light)',
              padding: '0 12px 8px 12px',
            }}
          >
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--border-subtle)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                    }}
                  >
                    {item.badge}
                  </span>
                )}

                {typeof item.count === 'number' && item.count > 0 && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '1px 7px',
                      borderRadius: '10px',
                      backgroundColor: isActive ? 'rgba(108, 79, 246, 0.15)' : 'var(--border-subtle)',
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Card */}
      <div
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, var(--primary-light) 100%)',
          border: '1px solid var(--primary-border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GraduationCap size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Active Recall Method
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Transform notes into structured recall decks to double memory retention.
        </p>
      </div>
    </aside>
  );
};
