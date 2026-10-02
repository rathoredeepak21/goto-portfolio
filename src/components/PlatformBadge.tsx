import React from 'react';
import { Globe, Monitor, Laptop, Smartphone } from 'lucide-react';

interface PlatformBadgeProps {
  name: string;
  icon?: string;
  size?: 'small' | 'medium';
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  name,
  icon,
  size = 'small',
}) => {
  const normalized = (name || '').trim().toLowerCase();
  const iconNormalized = (icon || '').trim().toLowerCase();

  // Determine platform type & styling theme
  let platformType: 'android' | 'ios' | 'web' | 'desktop' | 'generic' = 'generic';

  if (
    normalized.includes('android') ||
    iconNormalized.includes('android')
  ) {
    platformType = 'android';
  } else if (
    normalized.includes('ios') ||
    normalized.includes('apple') ||
    iconNormalized.includes('apple') ||
    iconNormalized.includes('ios')
  ) {
    platformType = 'ios';
  } else if (
    normalized.includes('web') ||
    normalized.includes('website') ||
    iconNormalized.includes('globe') ||
    iconNormalized.includes('web')
  ) {
    platformType = 'web';
  } else if (
    normalized.includes('desktop') ||
    normalized.includes('mac') ||
    normalized.includes('windows') ||
    normalized.includes('linux') ||
    iconNormalized.includes('monitor') ||
    iconNormalized.includes('laptop')
  ) {
    platformType = 'desktop';
  }

  const renderIcon = () => {
    const iconSize = size === 'small' ? 13 : 15;

    switch (platformType) {
      case 'android':
        return (
          <img
            src="/logos/android.svg"
            alt="Android"
            className="platform-badge-svg"
            style={{ width: iconSize, height: iconSize }}
            onError={(e) => {
              // Fallback to smartphone icon if SVG cannot be loaded
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      case 'ios':
        return (
          <img
            src="/logos/apple.svg"
            alt="Apple iOS"
            className="platform-badge-svg"
            style={{ width: iconSize, height: iconSize }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      case 'web':
        return <Globe size={iconSize} className="platform-lucide-icon" />;
      case 'desktop':
        return <Monitor size={iconSize} className="platform-lucide-icon" />;
      default:
        if (iconNormalized.includes('smartphone')) {
          return <Smartphone size={iconSize} className="platform-lucide-icon" />;
        }
        if (iconNormalized.includes('laptop')) {
          return <Laptop size={iconSize} className="platform-lucide-icon" />;
        }
        return <Globe size={iconSize} className="platform-lucide-icon" />;
    }
  };

  return (
    <span className={`platform-badge platform-badge-${platformType} size-${size}`}>
      <span className="platform-icon-wrap">{renderIcon()}</span>
      <span className="platform-name">{name}</span>

      <style>{`
        .platform-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.38rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          letter-spacing: 0.02em;
          white-space: nowrap;
          transition: all var(--transition-fast);
          user-select: none;
        }

        .platform-badge.size-small {
          padding: 0.22rem 0.65rem;
          font-size: 0.76rem;
          line-height: 1.2;
        }

        .platform-badge.size-medium {
          padding: 0.32rem 0.85rem;
          font-size: 0.84rem;
          line-height: 1.3;
        }

        .platform-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .platform-badge-svg {
          object-fit: contain;
          vertical-align: middle;
        }

        /* Android Style */
        .platform-badge-android {
          background: rgba(61, 220, 132, 0.08);
          border: 1px solid rgba(61, 220, 132, 0.32);
          color: #4ade80;
        }
        .platform-badge-android:hover {
          background: rgba(61, 220, 132, 0.14);
          border-color: rgba(61, 220, 132, 0.55);
          box-shadow: 0 0 10px rgba(61, 220, 132, 0.25);
        }

        /* iOS / Apple Style */
        .platform-badge-ios {
          background: rgba(226, 232, 240, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.3);
          color: #f1f5f9;
        }
        .platform-badge-ios:hover {
          background: rgba(226, 232, 240, 0.14);
          border-color: rgba(226, 232, 240, 0.55);
          box-shadow: 0 0 10px rgba(226, 232, 240, 0.22);
        }

        /* Web / Website Style */
        .platform-badge-web {
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.32);
          color: #38bdf8;
        }
        .platform-badge-web:hover {
          background: rgba(56, 189, 248, 0.14);
          border-color: rgba(56, 189, 248, 0.55);
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
        }

        /* Desktop Style */
        .platform-badge-desktop {
          background: rgba(168, 85, 247, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.32);
          color: #c084fc;
        }
        .platform-badge-desktop:hover {
          background: rgba(168, 85, 247, 0.14);
          border-color: rgba(168, 85, 247, 0.55);
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.25);
        }

        /* Generic Style */
        .platform-badge-generic {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-neon);
          color: var(--text-main);
        }
      `}</style>
    </span>
  );
};
