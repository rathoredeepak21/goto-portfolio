import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ScreenshotLightboxProps {
  appName: string;
  screenshots: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ScreenshotLightbox: React.FC<ScreenshotLightboxProps> = ({
  appName,
  screenshots,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || screenshots.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lightbox-header">
          <div>
            <h3 className="lightbox-title">{appName} — Screenshots</h3>
            <p className="lightbox-subtitle">A quick look at the app ({currentIndex + 1} of {screenshots.length})</p>
          </div>
          <button className="lightbox-close-btn" onClick={onClose} aria-label="Close lightbox">
            <X size={22} />
          </button>
        </div>

        {/* Carousel Area */}
        <div className="lightbox-body">
          <button className="carousel-nav-btn prev-btn" onClick={handlePrev} aria-label="Previous screenshot">
            <ChevronLeft size={24} />
          </button>

          <div className="carousel-slide-viewport">
            <div className="phone-frame-container">
              <div className="phone-notch" />
              <img
                src={screenshots[currentIndex]}
                alt={`${appName} screenshot ${currentIndex + 1}`}
                className="lightbox-active-img"
              />
            </div>
          </div>

          <button className="carousel-nav-btn next-btn" onClick={handleNext} aria-label="Next screenshot">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="lightbox-pagination">
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              className={`pagination-dot ${idx === currentIndex ? 'dot-active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 8, 16, 0.94);
          backdrop-filter: blur(12px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease-out;
        }

        .lightbox-modal {
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .lightbox-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .lightbox-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
        }

        .lightbox-subtitle {
          font-size: 0.9rem;
          color: var(--neon-cyan);
        }

        .lightbox-close-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .lightbox-close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #ef4444;
        }

        .lightbox-body {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          gap: 1.5rem;
        }

        .carousel-nav-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(14, 23, 42, 0.85);
          border: 1px solid var(--border-neon);
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--glow-cyan);
          transition: all var(--transition-fast);
          z-index: 10;
        }

        .carousel-nav-btn:hover {
          transform: scale(1.1);
          background: var(--neon-cyan);
          color: #070b14;
        }

        .phone-frame-container {
          width: 290px;
          height: 520px;
          border-radius: 36px;
          border: 4px solid #1e293b;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.25);
          position: relative;
          overflow: hidden;
          background: #000000;
        }

        .phone-notch {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 18px;
          background: #0f172a;
          border-radius: 10px;
          z-index: 5;
        }

        .lightbox-active-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .lightbox-pagination {
          display: flex;
          gap: 0.6rem;
          margin-top: 1.5rem;
        }

        .pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all var(--transition-fast);
        }

        .dot-active {
          width: 24px;
          border-radius: 4px;
          background: var(--neon-cyan);
          box-shadow: 0 0 10px var(--neon-cyan);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
