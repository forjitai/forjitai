import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

/* ── Error Boundary — prevents blank screen on crash ───────────────────── */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[Forjit AI] App crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0c0a09', color: '#e7e5e4',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', fontFamily: 'system-ui, sans-serif',
          padding: '24px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
          <h1 style={{ color: '#f59e0b', fontSize: '22px', marginBottom: '8px' }}>
            Forjit AI
          </h1>
          <p style={{ color: '#a8a29e', marginBottom: '24px', maxWidth: '360px' }}>
            Something went wrong while loading. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#f59e0b', color: '#0c0a09', border: 'none',
              padding: '10px 24px', borderRadius: '8px', fontWeight: '700',
              fontSize: '15px', cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
          <p style={{ color: '#57534e', fontSize: '12px', marginTop: '32px' }}>
            © 2026 Forjit AI · forjitai@gmail.com
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── Remove skeleton loader once React takes over ───────────────────────── */
const skeleton = document.getElementById('app-skeleton');
if (skeleton) skeleton.remove();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
