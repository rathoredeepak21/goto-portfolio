import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface DownloadButtonsProps {
  project: Project;
  onDownloadApk?: () => void;
  size?: 'normal' | 'large';
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  project,
  onDownloadApk,
  size = 'normal',
}) => {
  const showPlayStore = project.playStoreEnabled && Boolean(project.playStoreUrl?.trim());
  const showApk = project.apkDownloadEnabled && Boolean(project.apkDownloadUrl?.trim());

  if (!showPlayStore && !showApk) {
    return null; // Never display an empty button or container
  }

  const handleApkClick = () => {
    if (onDownloadApk) {
      onDownloadApk();
    }
  };

  return (
    <div className={`download-buttons-group ${size === 'large' ? 'buttons-large' : ''}`}>
      {/* Google Play Button */}
      {showPlayStore && (
        <a
          href={project.playStoreUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-google-play"
          title={`Get ${project.title} on Google Play`}
        >
          {/* Authentic Google Play Icon */}
          <svg className="gp-svg-icon" viewBox="0 0 512 512" width="24" height="24">
            <path
              d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"
              fill="#ea4335"
            />
            <path
              d="M47 38.3v435.4c0 10.9 6.2 20.8 16.1 25.7l262.2-265L63.1 12.6C53.2 17.5 47 27.4 47 38.3z"
              fill="#4285f4"
            />
            <path
              d="M325.3 277.7l-60.1-60.1L63.1 499.4c3.9 2 8.3 3.1 12.8 3.1 5.4 0 10.7-1.6 15.3-4.5l234.1-134.4-0.1 0.1-0.1-0.1 0.2 0.2z"
              fill="#34a853"
            />
            <path
              d="M455.5 229.9L385.4 189.6 325.3 249.7l60.1 60.1 70.1-40.3c15.8-9.1 25.5-25.8 25.5-44.8s-9.7-35.7-25.5-44.8z"
              fill="#fbbc04"
            />
          </svg>
          <div className="gp-label">
            <span className="gp-sub">GET IT ON</span>
            <span className="gp-main">Google Play</span>
          </div>
        </a>
      )}

      {/* APK Download Button */}
      {showApk && (
        <a
          href={project.apkDownloadUrl}
          onClick={handleApkClick}
          download
          className="btn btn-apk"
          title={`Download ${project.title} APK (${project.apkSize})`}
        >
          <Download size={18} className="apk-dl-icon" />
          <span>Download APK</span>
          {project.apkSize && <span className="apk-size-pill">{project.apkSize}</span>}
        </a>
      )}

      <style>{`
        .download-buttons-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .buttons-large .btn-google-play {
          padding: 0.65rem 1.4rem;
        }

        .buttons-large .btn-apk {
          padding: 0.85rem 1.8rem;
          font-size: 1.05rem;
        }

        .gp-svg-icon {
          flex-shrink: 0;
        }

        .apk-dl-icon {
          transition: transform 0.2s ease;
        }

        .btn-apk:hover .apk-dl-icon {
          transform: translateY(2px);
        }

        .apk-size-pill {
          font-size: 0.72rem;
          padding: 0.15rem 0.5rem;
          background: rgba(0, 0, 0, 0.25);
          border-radius: var(--radius-full);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
