import React from 'react';
import { WebsiteContent, SocialLink } from '../types';
import { Heart } from 'lucide-react';
import { SocialIcon } from './SocialIcons';

import { initialWebsiteContent, initialSocialLinks } from '../services/mockData';

interface FooterProps {
  content?: WebsiteContent['footer'];
  socialLinks?: SocialLink[];
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  content: rawContent,
  socialLinks: rawSocialLinks,
  onNavigate,
}) => {
  const content = rawContent || initialWebsiteContent.footer;
  const socialLinks = rawSocialLinks || initialSocialLinks;


  return (
    <footer className="site-footer">
      <div className="content-wrapper footer-content">
        {/* Brand & Tagline */}
        <div className="footer-brand-section">
          <div className="footer-logo-row" onClick={() => onNavigate('home')}>
            <div className="footer-logo-shield">
              <svg viewBox="0 0 40 40" className="shield-svg">
                <polygon points="20,4 36,12 36,28 20,36 4,28 4,12" stroke="#38bdf8" strokeWidth="2.5" fill="#0d1527" />
                <polygon points="20,11 30,17 20,30 10,17" fill="#38bdf8" />
              </svg>
            </div>
            <span className="footer-brand-name">{content.brandName || 'GoTop'}</span>
          </div>
          <p className="footer-tagline">{content.tagline || 'Build • Innovate • Grow'}</p>
        </div>

        {/* Social Links Section */}
        <div className="footer-social-section">
          <span className="footer-social-title">Follow Me</span>
          <div className="footer-social-icons">
            {(socialLinks || []).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="social-icon-btn"
                title={link.label}
                aria-label={link.label}
              >
                <SocialIcon name={link.icon} size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="content-wrapper bottom-bar-inner">
          <span className="copyright-text">{content.copyrightText}</span>
          <span className="made-with-text">
            Made with <Heart size={14} className="heart-icon" fill="#ef4444" color="#ef4444" /> by GoTop
          </span>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #05080f;
          border-top: 1px solid var(--border-subtle);
          padding-top: 3.5rem;
          margin-top: 4rem;
          position: relative;
        }

        [data-theme='light'] .site-footer {
          background: #ffffff;
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .footer-brand-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-logo-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .footer-logo-shield {
          width: 32px;
          height: 32px;
          filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
        }

        .footer-brand-name {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-main);
        }

        .footer-tagline {
          font-size: 0.95rem;
          color: var(--neon-cyan);
          letter-spacing: 0.1em;
          font-weight: 500;
        }

        .footer-social-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.75rem;
        }

        @media (max-width: 640px) {
          .footer-social-section {
            align-items: flex-start;
          }
        }

        .footer-social-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .footer-social-icons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .social-icon-btn:hover {
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
          background: rgba(56, 189, 248, 0.1);
          transform: translateY(-3px);
          box-shadow: var(--glow-cyan);
        }

        .footer-bottom-bar {
          border-top: 1px solid var(--border-subtle);
          padding: 1.25rem 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .bottom-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-dim);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .made-with-text {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .heart-icon {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </footer>
  );
};
