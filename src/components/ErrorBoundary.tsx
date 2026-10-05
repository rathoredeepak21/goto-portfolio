import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="neon-card" style={{ maxWidth: 500, textAlign: 'center', padding: '2.5rem 2rem' }}>
            <h2 style={{ color: 'var(--text-main, #f8fafc)', marginBottom: '0.75rem' }}>Unable to display content</h2>
            <p style={{ color: 'var(--text-muted, #94a3b8)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              We encountered a minor issue loading this section. Your portfolio data is safe.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                if (typeof window !== 'undefined') window.location.href = '/';
              }}
              className="btn btn-primary"
            >
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
