import React, { useState } from 'react';
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

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  const mainScreenshot = screenshots[0];
  const miniPreviews = screenshots.slice(1, 4);
  const moreCount = Math.max(0, screenshots.length - 4);

  const openAt = (idx: number) => {
    setSelectedIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="screenshot-gallery-container">
      {/* Featured Primary Mobile Phone Mockup */}
      <div className="primary-phone-frame" onClick={() => openAt(0)}>
        <div className="phone-screen-glare" />
        <div className="phone-top-speaker" />
        <img
          src={mainScreenshot}
          alt={`${appName} Main Screenshot`}
          className="phone-screen-img"
          loading="lazy"
        />
        <div className="hover-expand-pill">
          <Maximize2 size={14} />
          <span>Click to Zoom</span>
        </div>
      </div>

      {/* Thumbnails Row below primary screen */}
      <div className="gallery-thumbs-grid">
        {miniPreviews.map((src, idx) => (
          <div
            key={idx}
            className="thumb-card"
            onClick={() => openAt(idx + 1)}
            title={`View screenshot ${idx + 2}`}
          >
            <img src={src} alt={`${appName} thumb ${idx + 2}`} className="thumb-img" loading="lazy" />
          </div>
        ))}

        {/* "+N More" interactive card matching reference */}
        {moreCount > 0 ? (
          <div
            className="thumb-card more-card"
            onClick={() => openAt(4)}
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
              onClick={() => openAt(0)}
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

        .phone-screen-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
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
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .thumb-card:hover {
          transform: translateY(-2px);
          border-color: var(--neon-cyan);
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
