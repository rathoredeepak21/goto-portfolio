import React, { useState, useEffect } from 'react';
import { ScreenshotLightbox } from './ScreenshotLightbox';
import { Maximize2, Layers } from 'lucide-react';

interface ScreenshotGalleryProps {
  appName: string;
  screenshots: string[];
}

export const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({
  appName,
  screenshots,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Reset index if screenshots change or shrink
  useEffect(() => {
    if (currentIndex >= (screenshots?.length || 0)) {
      setCurrentIndex(0);
    }
  }, [screenshots?.length]);

  // Reset index when app changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [appName]);

  // Auto-change carousel with ~3.5 seconds interval
  // Cycle: 0 -> 1 -> 2 -> ... -> N-1 -> 0
  // Disables if only 1 screenshot, pauses while hovering
  useEffect(() => {
    if (!screenshots || screenshots.length <= 1 || isHovered) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [screenshots?.length, currentIndex, isHovered]);

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="no-screenshots-placeholder" style={{ padding: '2.5rem 1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No screenshots uploaded for this project yet.</p>
      </div>
    );
  }

  const miniPreviews = screenshots.slice(1, 4);
  const moreCount = Math.max(0, screenshots.length - 4);

  const openLightboxAt = (idx: number) => {
    setSelectedIndex(idx);
    setLightboxOpen(true);
  };

  const handleThumbnailClick = (targetIndex: number) => {
    setCurrentIndex(targetIndex);
  };

  return (
    <div className="screenshot-gallery-container">
      {/* Featured Primary Mobile Phone Mockup */}
      <div
        className="primary-phone-frame"
        onClick={() => openLightboxAt(currentIndex)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Click to zoom screenshot"
      >
        <div className="phone-screen-glare" />
        <div className="phone-top-speaker" />

        {/* Smooth cross-fade rotating screens */}
        <div className="phone-screens-wrapper">
          {screenshots.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${appName} Screenshot ${idx + 1}`}
              className={`phone-screen-img ${idx === currentIndex ? 'active' : ''}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        <div className="hover-expand-pill">
          <Maximize2 size={14} />
          <span>Click to Zoom</span>
        </div>
      </div>

      {/* Thumbnails Row below primary screen */}
      <div className="gallery-thumbs-grid">
        {miniPreviews.map((src, idx) => {
          const actualIndex = idx + 1;
          const isActive = currentIndex === actualIndex;
          return (
            <div
              key={idx}
              className={`thumb-card ${isActive ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(actualIndex)}
              title={`Switch to screenshot ${actualIndex + 1}`}
            >
              <img
                src={src}
                alt={`${appName} thumb ${actualIndex + 1}`}
                className="thumb-img"
                loading="lazy"
              />
            </div>
          );
        })}

        {/* "+N More" / "Full View" interactive card matching reference */}
        {moreCount > 0 ? (
          <div
            className="thumb-card more-card"
            onClick={() => openLightboxAt(4)}
            title="View all screenshots"
          >
            <Layers size={18} color="#38bdf8" />
            <span className="more-count-num">+{moreCount}</span>
            <span className="more-count-lbl">More</span>
          </div>
        ) : (
          screenshots.length > 1 && (
            <div
              className="thumb-card more-card"
              onClick={() => openLightboxAt(currentIndex)}
              title="View all gallery"
            >
              <Maximize2 size={16} color="#38bdf8" />
              <span className="more-count-lbl">Full View</span>
            </div>
          )
        )}
      </div>

      {/* Lightbox Modal */}
      <ScreenshotLightbox
        appName={appName}
        screenshots={screenshots}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <style>{`
        .screenshot-gallery-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
        }

        .primary-phone-frame {
          width: 280px;
          height: 480px;
          border-radius: 36px;
          background: #000000;
          border: 4px solid #1e293b;
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.2);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .primary-phone-frame:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.4);
        }

        .phone-top-speaker {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 6px;
          background: #334155;
          border-radius: 4px;
          z-index: 5;
        }

        .phone-screens-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .phone-screen-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transform: scale(1.02);
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
          pointer-events: none;
        }

        .phone-screen-img.active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .hover-expand-pill {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(14, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-neon);
          color: var(--neon-cyan);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 10;
        }

        .primary-phone-frame:hover .hover-expand-pill {
          opacity: 1;
          transform: translateX(-50%) translateY(-2px);
        }

        .gallery-thumbs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          width: 100%;
          max-width: 320px;
        }

        .thumb-card {
          aspect-ratio: 9 / 16;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          position: relative;
          transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .thumb-card:hover {
          transform: translateY(-2px);
          border-color: var(--neon-cyan);
        }

        .thumb-card.active {
          border-color: var(--neon-cyan);
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .more-card {
          background: rgba(14, 23, 42, 0.9);
          border: 1px dashed var(--border-neon);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
          color: var(--neon-cyan);
        }

        .more-count-num {
          font-size: 1.1rem;
          font-weight: 800;
          line-height: 1;
        }

        .more-count-lbl {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
