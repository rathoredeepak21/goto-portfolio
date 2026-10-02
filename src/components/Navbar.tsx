import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sun, Moon, Shield, Menu, X, Terminal, ExternalLink } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, slug?: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  settings: WebsiteSettings;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  theme,
  onToggleTheme,
  settings,
  isAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Body scroll lock & Escape key handler when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };

      const handleResize = () => {
        if (window.innerWidth > 860) {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner content-wrapper">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => handleLinkClick('home')} role="button" tabIndex={0}>
          <div className="logo-shield">
            <svg viewBox="0 0 40 40" className="shield-svg">
              <defs>
                <linearGradient id="navG" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <polygon points="20,4 36,12 36,28 20,36 4,28 4,12" stroke="url(#navG)" strokeWidth="2.5" fill="#0d1527" />
              <polygon points="20,11 30,17 20,30 10,17" fill="url(#navG)" />
            </svg>
          </div>
          <span className="brand-name">{settings.logoText || 'GoTop'}</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.label}
                {isActive && <span className="active-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Admin Badge */}
        <div className="navbar-actions">
          {/* Dark / Light Toggle Pill */}
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            <div className={`theme-switch-thumb ${theme === 'light' ? 'thumb-light' : 'thumb-dark'}`}>
              {theme === 'dark' ? <Moon size={13} className="theme-icon" /> : <Sun size={13} className="theme-icon" />}
            </div>
          </button>

          {/* Admin Access Pill */}
          <button
            onClick={() => handleLinkClick('admin')}
            className={`admin-portal-btn ${currentTab.startsWith('admin') ? 'active-admin' : ''}`}
            title="Admin Management Panel"
          >
            <Shield size={14} />
            <span className="admin-btn-label">{isAdmin ? 'Admin' : 'Login'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-trigger"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu rendered via portal into document.body to ensure perfect layering & stacking */}
      {mobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="mobile-drawer-overlay"
            onClick={() => setMobileMenuOpen(false)}
            data-theme={theme}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div
              className="mobile-drawer"
              onClick={(e) => e.stopPropagation()}
              data-theme={theme}
            >
              {/* Header: Logo on Left, Close (✕) on Right */}
              <div className="mobile-drawer-header">
                <div
                  className="navbar-brand"
                  onClick={() => handleLinkClick('home')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="logo-shield">
                    <svg viewBox="0 0 40 40" className="shield-svg">
                      <defs>
                        <linearGradient id="drawerNavG" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <polygon
                        points="20,4 36,12 36,28 20,36 4,28 4,12"
                        stroke="url(#drawerNavG)"
                        strokeWidth="2.5"
                        fill="#0d1527"
                      />
                      <polygon points="20,11 30,17 20,30 10,17" fill="url(#drawerNavG)" />
                    </svg>
                  </div>
                  <span className="brand-name">{settings.logoText || 'GoTop'}</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="drawer-close-btn"
                  aria-label="Close navigation menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Navigation Links matching Section 4 */}
              <div className="mobile-nav-list">
                {navLinks.map((link) => {
                  const isActive = currentTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id)}
                      className={`mobile-nav-item ${isActive ? 'mobile-nav-active' : ''}`}
                    >
                      <span className="mobile-nav-label">{link.label}</span>
                      {isActive && <span className="mobile-active-pill">Active</span>}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Extras: Theme Toggle and Admin Panel matching Section 4 */}
              <div className="mobile-menu-extras">
                <button
                  onClick={onToggleTheme}
                  className="mobile-extra-item mobile-theme-btn"
                  aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                  <div className="mobile-extra-left">
                    {theme === 'dark' ? (
                      <Moon size={18} className="extra-icon cyan" />
                    ) : (
                      <Sun size={18} className="extra-icon amber" />
                    )}
                    <span className="extra-label">
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  <span className="theme-toggle-indicator">
                    {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </span>
                </button>

                <button
                  onClick={() => handleLinkClick('admin')}
                  className={`mobile-extra-item mobile-admin-btn ${currentTab.startsWith('admin') ? 'mobile-nav-active' : ''}`}
                >
                  <div className="mobile-extra-left">
                    <Shield size={18} className="extra-icon cyan" />
                    <span className="extra-label">
                      {isAdmin ? 'Admin Dashboard' : 'Admin Login'}
                    </span>
                  </div>
                  <span className="admin-status-badge">
                    {isAdmin ? 'Active' : 'Portal'}
                  </span>
                </button>
              </div>

              {/* Footer */}
              <div className="mobile-drawer-footer">
                <span className="drawer-caption">
                  {settings.websiteName || 'GoTop Developer Portfolio'} &bull; 2026
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(7, 11, 20, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          transition: background-color var(--transition-smooth);
        }

        [data-theme='light'] .navbar-container {
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid var(--border-subtle);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        }

        @media (max-width: 860px) {
          .navbar-container {
            /* Solid opaque on mobile so hero and page content do not bleed through when scrolling */
            background: #070b14;
            border-bottom: 1px solid rgba(56, 189, 248, 0.15);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
          }

          [data-theme='light'] .navbar-container {
            background: #ffffff;
            border-bottom: 1px solid rgba(203, 213, 225, 0.8);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          }
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .logo-shield {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.6));
        }

        .shield-svg {
          width: 100%;
          height: 100%;
        }

        .brand-name {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-main);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          position: relative;
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.5rem 0.2rem;
          transition: color var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--neon-cyan);
        }

        .nav-link-active {
          color: var(--text-main);
          font-weight: 600;
        }

        .active-dot {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--neon-cyan);
          box-shadow: 0 0 8px var(--neon-cyan);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        /* Theme Toggle Switch Pill */
        .theme-toggle-btn {
          width: 52px;
          height: 28px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-neon);
          border-radius: var(--radius-full);
          position: relative;
          padding: 2px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
          transition: all var(--transition-fast);
        }

        .theme-toggle-btn:hover {
          border-color: var(--neon-cyan);
        }

        .theme-switch-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--grad-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .thumb-dark {
          transform: translateX(0);
        }

        .thumb-light {
          transform: translateX(24px);
        }

        .theme-icon {
          color: #ffffff;
        }

        .admin-portal-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid var(--border-neon);
          border-radius: var(--radius-full);
          color: var(--neon-cyan);
          font-size: 0.82rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .admin-portal-btn:hover,
        .active-admin {
          background: var(--neon-cyan);
          color: #070b14;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
        }

        .mobile-menu-trigger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 0;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        [data-theme='light'] .mobile-menu-trigger {
          color: #0f172a;
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .mobile-menu-trigger:hover {
          color: var(--neon-cyan);
          border-color: var(--border-neon);
          background: rgba(56, 189, 248, 0.1);
        }

        /* ==============================================================
           MOBILE NAVIGATION DRAWER & OVERLAY (Fixed High Stacking Layer)
           ============================================================== */
        .mobile-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: rgba(3, 7, 18, 0.88); /* Sufficiently opaque backdrop in dark mode */
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 10000; /* Always sits on top of all page content, heroes, cards, etc. */
          display: flex;
          justify-content: flex-end;
          animation: fadeInOverlay 0.22s ease-out forwards;
        }

        [data-theme='light'] .mobile-drawer-overlay {
          background: rgba(15, 23, 42, 0.6); /* Opaque backdrop in light mode */
        }

        .mobile-drawer {
          width: min(360px, 88vw);
          height: 100%;
          height: 100dvh;
          background: #080d1a; /* Solid 100% opaque dark background — completely hides background content */
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(56, 189, 248, 0.25);
          box-shadow: -15px 0 45px rgba(0, 0, 0, 0.85);
          animation: slideInRight 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          z-index: 10001;
        }

        [data-theme='light'] .mobile-drawer {
          background: #ffffff; /* Solid 100% opaque light background in light mode */
          border-left: 1px solid rgba(14, 165, 233, 0.25);
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.2);
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        [data-theme='light'] .mobile-drawer-header {
          border-bottom-color: rgba(203, 213, 225, 0.8);
        }

        .drawer-close-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        [data-theme='light'] .drawer-close-btn {
          color: #0f172a;
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .drawer-close-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.1);
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1.25rem;
          flex: 1;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 48px;
          padding: 0.85rem 1.15rem;
          border-radius: var(--radius-md);
          color: #f1f5f9; /* Bright high contrast in dark mode */
          font-size: 1.05rem;
          font-weight: 600;
          text-align: left;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        [data-theme='light'] .mobile-nav-item {
          color: #0f172a; /* Deep crisp dark text in light mode */
          background: rgba(0, 0, 0, 0.02);
        }

        .mobile-nav-item:hover {
          background: rgba(56, 189, 248, 0.1);
          color: var(--neon-cyan);
          border-color: rgba(56, 189, 248, 0.25);
        }

        [data-theme='light'] .mobile-nav-item:hover {
          background: rgba(2, 132, 199, 0.08);
          color: var(--neon-cyan);
          border-color: rgba(2, 132, 199, 0.25);
        }

        .mobile-nav-item.mobile-nav-active {
          background: rgba(56, 189, 248, 0.16);
          color: var(--neon-cyan);
          border: 1px solid rgba(56, 189, 248, 0.45);
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.2);
          font-weight: 700;
        }

        [data-theme='light'] .mobile-nav-item.mobile-nav-active {
          background: rgba(2, 132, 199, 0.12);
          color: var(--neon-cyan);
          border: 1px solid rgba(2, 132, 199, 0.4);
          box-shadow: 0 2px 10px rgba(2, 132, 199, 0.15);
          font-weight: 700;
        }

        .mobile-active-pill {
          font-size: 0.72rem;
          padding: 0.15rem 0.55rem;
          border-radius: var(--radius-full);
          background: rgba(56, 189, 248, 0.22);
          color: var(--neon-cyan);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        [data-theme='light'] .mobile-active-pill {
          background: rgba(2, 132, 199, 0.18);
          color: var(--neon-cyan);
        }

        /* Mobile Extras: Theme Toggle and Admin Panel matching Section 4 */
        .mobile-menu-extras {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-top: 1.25rem;
          margin-top: auto;
          border-top: 1px solid var(--border-subtle);
        }

        [data-theme='light'] .mobile-menu-extras {
          border-top-color: rgba(203, 213, 225, 0.8);
        }

        .mobile-extra-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 48px;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-main);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        [data-theme='light'] .mobile-extra-item {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .mobile-extra-item:hover {
          border-color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.08);
        }

        [data-theme='light'] .mobile-extra-item:hover {
          border-color: var(--neon-cyan);
          background: rgba(2, 132, 199, 0.06);
        }

        .mobile-extra-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .extra-icon.cyan {
          color: var(--neon-cyan);
        }

        .extra-icon.amber {
          color: #f59e0b;
        }

        .theme-toggle-indicator,
        .admin-status-badge {
          font-size: 0.8rem;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
        }

        [data-theme='light'] .theme-toggle-indicator,
        [data-theme='light'] .admin-status-badge {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #334155;
        }

        .mobile-admin-btn.mobile-nav-active {
          background: rgba(56, 189, 248, 0.16);
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
        }

        .mobile-drawer-footer {
          padding-top: 1rem;
          margin-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          text-align: center;
        }

        [data-theme='light'] .mobile-drawer-footer {
          border-top-color: rgba(203, 213, 225, 0.8);
        }

        .drawer-caption {
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 860px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-trigger {
            display: flex;
          }
          .admin-btn-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
