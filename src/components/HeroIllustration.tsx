import React from 'react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="hero-illustration-wrapper">
      <div className="illustration-glow-ambient" />
      <svg
        className="hero-3d-svg"
        viewBox="0 0 600 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="neonCyanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          <radialGradient id="platformGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#070b14" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Isometric Grid Platform */}
        <ellipse cx="300" cy="380" rx="260" ry="85" fill="url(#platformGlow)" />

        <g className="grid-lines" opacity="0.35" stroke="#38bdf8" strokeWidth="1">
          <line x1="120" y1="380" x2="480" y2="380" />
          <line x1="160" y1="350" x2="440" y2="350" />
          <line x1="200" y1="320" x2="400" y2="320" />
          <line x1="150" y1="410" x2="450" y2="410" />

          <line x1="300" y1="280" x2="160" y2="430" />
          <line x1="300" y1="280" x2="440" y2="430" />
          <line x1="300" y1="280" x2="230" y2="440" />
          <line x1="300" y1="280" x2="370" y2="440" />
        </g>

        {/* Base Pedestal for Laptop */}
        <polygon
          points="200,340 400,340 460,390 140,390"
          fill="#0d1527"
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="1.5"
        />

        {/* Isometric Laptop Base */}
        <polygon
          points="220,325 380,325 435,365 165,365"
          fill="url(#laptopGrad)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        {/* Trackpad */}
        <polygon
          points="280,342 320,342 325,358 275,358"
          fill="#1e293b"
          stroke="rgba(255, 255, 255, 0.15)"
        />

        {/* Laptop Screen (Upright isometric) */}
        <polygon
          points="220,325 380,325 380,170 220,170"
          fill="#0b1120"
          stroke="#475569"
          strokeWidth="2"
        />
        {/* Display Inner Surface with Code Glow */}
        <polygon
          points="230,315 370,315 370,180 230,180"
          fill="url(#screenGrad)"
          opacity="0.85"
        />
        {/* Code Lines on Screen */}
        <line x1="245" y1="200" x2="295" y2="200" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <line x1="305" y1="200" x2="355" y2="200" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        <line x1="245" y1="215" x2="335" y2="215" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="260" y1="230" x2="310" y2="230" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="260" y1="245" x2="345" y2="245" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="245" y1="260" x2="280" y2="260" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />

        {/* Floating Neon Code Badge `< / >` */}
        <g className="floating-code-badge" filter="url(#softGlow)">
          <rect
            x="410"
            y="130"
            width="125"
            height="95"
            rx="20"
            fill="#0f172a"
            stroke="url(#neonCyanPurple)"
            strokeWidth="2.5"
          />
          <text
            x="472"
            y="188"
            fill="#38bdf8"
            fontFamily="var(--font-mono), monospace"
            fontSize="32"
            fontWeight="bold"
            textAnchor="middle"
          >
            &lt; / &gt;
          </text>
        </g>

        {/* Smartphone Mockup on the Left */}
        <g className="floating-phone">
          <rect
            x="95"
            y="220"
            width="75"
            height="135"
            rx="14"
            fill="#0f172a"
            stroke="#6366f1"
            strokeWidth="2"
          />
          <rect x="103" y="235" width="59" height="105" rx="8" fill="#1e1b4b" />
          <circle cx="132" cy="270" r="14" fill="#38bdf8" opacity="0.6" />
          <rect x="112" y="295" width="41" height="6" rx="3" fill="#818cf8" />
          <rect x="117" y="306" width="31" height="4" rx="2" fill="#a5b4fc" />
        </g>

        {/* Floating Futuristic Particles */}
        <circle cx="480" cy="280" r="8" fill="#a855f7" className="particle-float-1" />
        <circle cx="150" cy="160" r="6" fill="#38bdf8" className="particle-float-2" />
        <circle cx="390" cy="100" r="4" fill="#10b981" />
        <circle cx="210" cy="120" r="5" fill="#f43f5e" />

        {/* Orbit Rings */}
        <ellipse
          cx="300"
          cy="260"
          rx="220"
          ry="70"
          stroke="url(#neonCyanPurple)"
          strokeWidth="1.2"
          strokeDasharray="8 8"
          opacity="0.4"
        />
      </svg>

      <style>{`
        .hero-illustration-wrapper {
          position: relative;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .illustration-glow-ambient {
          position: absolute;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 75%);
          filter: blur(40px);
          z-index: 0;
          pointer-events: none;
        }

        .hero-3d-svg {
          width: 100%;
          height: auto;
          position: relative;
          z-index: 1;
        }

        .floating-code-badge {
          animation: floatSlow 4s ease-in-out infinite alternate;
        }

        .floating-phone {
          animation: floatReverse 4.5s ease-in-out infinite alternate;
        }

        .particle-float-1 {
          animation: pulseOrb 3s ease-in-out infinite alternate;
        }

        .particle-float-2 {
          animation: pulseOrb 3.5s ease-in-out 1s infinite alternate;
        }

        @keyframes floatSlow {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-14px) rotate(1.5deg); }
        }

        @keyframes floatReverse {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(12px) rotate(-1.5deg); }
        }

        @keyframes pulseOrb {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
