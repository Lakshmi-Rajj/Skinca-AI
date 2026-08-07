import React, { Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import { CLERK_PUBLISHABLE_KEY } from './engines/clerkAuthEngine';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[Skinca App Crash]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a1210',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          padding: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#ffffff' }}>Skinca AI Initializing...</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', maxWidth: 320, margin: '0 0 24px' }}>
            A temporary startup glitch occurred. Tap below to launch a fresh session.
          </p>
          <button
            onClick={() => {
              try { localStorage.clear(); } catch (e) {}
              window.location.reload();
            }}
            style={{
              padding: '14px 28px',
              borderRadius: '24px',
              border: 'none',
              background: '#326859',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(50,104,89,0.4)',
            }}
          >
            🔄 Launch App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');

const isProductionKey = CLERK_PUBLISHABLE_KEY.startsWith('pk_live_');
const proxyUrl = isProductionKey ? 'https://skinca-ai.vercel.app/__clerk' : undefined;

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY || 'pk_test_bGVuaWVudC1zdW5iaXJkLTgxLmNsZXJrLmFjY291bnRzLmRldiQ'}
          proxyUrl={proxyUrl}
        >
          <App />
        </ClerkProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
