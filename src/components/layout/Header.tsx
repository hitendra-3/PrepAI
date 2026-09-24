import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  Plus, 
  BookOpen, 
  History as HistoryIcon, 
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  favoritesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        style={{
          height: 'var(--header-height)',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 15,
        }}
      >
        {/* Mobile Hamburger & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-only-btn"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              display: 'none',
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Sparkles size={16} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-main)',
              }}
            >
              PrepAI
            </span>
          </div>
        </div>

        {/* Right Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--success)',
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={13} />
            <span>Structured JSON Engine</span>
          </div>

          <button
            onClick={() => handleNavClick('create')}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>New Set</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 30,
            display: 'flex',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '280px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary)" />
                <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>PrepAI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '6px', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`btn ${activeTab === 'home' ? 'btn-subtle' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start' }}
            >
              <BookOpen size={18} />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('create')}
              className={`btn ${activeTab === 'create' ? 'btn-subtle' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start' }}
            >
              <Plus size={18} />
              <span>New Study Set</span>
            </button>

            <button
              onClick={() => handleNavClick('history')}
              className={`btn ${activeTab === 'history' ? 'btn-subtle' : 'btn-ghost'}`}
              style={{ justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HistoryIcon size={18} />
                <span>History</span>
              </div>
              {savedCount > 0 && <span className="badge badge-primary">{savedCount}</span>}
            </button>

            <button
              onClick={() => handleNavClick('favorites')}
              className={`btn ${activeTab === 'favorites' ? 'btn-subtle' : 'btn-ghost'}`}
              style={{ justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bookmark size={18} />
                <span>Favorites</span>
              </div>
              {favoritesCount > 0 && <span className="badge badge-primary">{favoritesCount}</span>}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
