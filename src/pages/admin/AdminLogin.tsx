import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await onLogin(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
      }
    } catch {
      setErrorMsg('Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-view">
      <div className="login-card neon-card">
        {/* Shield Logo matching Panel 9 */}
        <div className="login-logo-wrapper">
          <div className="login-shield-icon">
            <Shield size={38} color="#38bdf8" />
          </div>
        </div>

        <h1 className="login-title">GoTop Admin</h1>
        <p className="login-subtitle">Sign in to continue</p>

        {errorMsg && <div className="login-error-alert">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="login-email" className="login-label">Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password" className="login-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary login-submit-btn">
            <span>{isLoading ? 'Signing In...' : 'Login'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer-links">
          <button
            type="button"
            onClick={() => alert('Password recovery: Password reset requests must be processed via Supabase Auth.')}
            className="forgot-pass-btn"
          >
            Forgot Password?
          </button>
          <span className="dot-sep">&bull;</span>
          <button type="button" onClick={onCancel} className="back-to-site-btn">
            Back to Website
          </button>
        </div>
      </div>

      <style>{`
        .admin-login-view {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 3rem 2.5rem;
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .login-logo-wrapper {
          margin-bottom: 1.25rem;
        }

        .login-shield-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-neon);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--glow-cyan);
        }

        .login-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .login-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        .login-error-alert {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: #fca5a5;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          text-align: left;
        }

        .login-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem 0.85rem 2.6rem;
          color: var(--text-main);
          font-size: 0.95rem;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .login-input:focus {
          outline: none;
          border-color: var(--neon-cyan);
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
        }

        .password-toggle-btn {
          position: absolute;
          right: 14px;
          color: var(--text-muted);
          padding: 0.25rem;
          transition: color var(--transition-fast);
        }

        .password-toggle-btn:hover {
          color: var(--text-main);
        }

        .login-submit-btn {
          width: 100%;
          padding: 0.95rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .login-footer-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.75rem;
          font-size: 0.88rem;
        }

        .forgot-pass-btn,
        .back-to-site-btn {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }

        .forgot-pass-btn:hover,
        .back-to-site-btn:hover {
          color: var(--neon-cyan);
        }

        .dot-sep {
          color: var(--text-dim);
        }
      `}</style>
    </div>
  );
};
