import React from 'react';
import { Technology } from '../types';
import { TechnologyLogo } from './TechnologyLogo';

interface TechnologyCardProps {
  technology: Technology;
  onClick?: () => void;
}

export const TechnologyCard: React.FC<TechnologyCardProps> = ({ technology, onClick }) => {
  return (
    <div
      className="tech-card-futuristic"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="tech-card-inner">
        {/* Official Brand Logo */}
        <div className="tech-card-logo-container">
          <TechnologyLogo
            name={technology.name}
            logoUrl={technology.logo_url}
            size={56}
            className="tech-brand-logo"
          />
        </div>

        {/* Technology Name */}
        <h3 className="tech-card-name">{technology.name}</h3>

        {/* Short category / specialty */}
        <p className="tech-card-category">
          {technology.description || technology.category}
        </p>
      </div>

      <style>{`
        .tech-card-futuristic {
          background: rgba(14, 23, 42, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(56, 189, 248, 0.16);
          border-radius: var(--radius-lg, 16px);
          padding: 2rem 1.4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.45), 0 0 15px rgba(56, 189, 248, 0.05);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.3s ease;
          cursor: default;
          overflow: hidden;
        }

        /* Subtle corner glow highlight */
        .tech-card-futuristic::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5), transparent);
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .tech-card-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .tech-card-logo-container {
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.15rem;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tech-card-name {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main, #f8fafc);
          letter-spacing: -0.01em;
          margin-bottom: 0.4rem;
          transition: color 0.2s ease;
        }

        .tech-card-category {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted, #94a3b8);
          line-height: 1.35;
          margin: 0;
        }

        /* Hover Effect as specified */
        .tech-card-futuristic:hover {
          transform: translateY(-6px);
          border-color: rgba(56, 189, 248, 0.65);
          box-shadow: 0 16px 35px -5px rgba(0, 0, 0, 0.6),
                      0 0 25px rgba(56, 189, 248, 0.22);
          background: rgba(19, 31, 56, 0.85);
        }

        .tech-card-futuristic:hover .tech-card-logo-container {
          transform: scale(1.08);
        }

        .tech-card-futuristic:hover .tech-card-name {
          color: #ffffff;
        }

        .tech-card-futuristic:hover::before {
          opacity: 1;
        }

        /* Light Theme support */
        [data-theme='light'] .tech-card-futuristic {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(14, 165, 233, 0.25);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06);
        }

        [data-theme='light'] .tech-card-futuristic:hover {
          background: #ffffff;
          border-color: rgba(14, 165, 233, 0.7);
          box-shadow: 0 16px 35px -5px rgba(14, 165, 233, 0.15);
        }
      `}</style>
    </div>
  );
};
