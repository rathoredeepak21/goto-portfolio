import React, { useState } from 'react';
import { getOfficialLogoUrl } from '../utils/logoUtils';

interface TechnologyLogoProps {
  name: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

export const TechnologyLogo: React.FC<TechnologyLogoProps> = ({
  name,
  logoUrl,
  size = 52,
  className = '',
}) => {
  const [loadError, setLoadError] = useState(false);
  const resolvedUrl = getOfficialLogoUrl(name, logoUrl);

  return (
    <div
      className={`tech-logo-wrapper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      title={name}
    >
      {!loadError ? (
        <img
          src={resolvedUrl}
          alt={`${name} official logo`}
          className="tech-logo-img"
          onError={() => setLoadError(true)}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
            margin: 'auto',
          }}
          loading="lazy"
        />
      ) : (
        <div
          className="tech-logo-fallback"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            fontSize: `${Math.max(12, Math.floor(size * 0.32))}px`,
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          {name.slice(0, 2)}
        </div>
      )}
    </div>
  );
};
