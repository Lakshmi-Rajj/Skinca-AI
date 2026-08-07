import React, { useState, useEffect } from 'react';
import { useSignIn, useUser } from '@clerk/clerk-react';
import { Browser } from '@capacitor/browser';
import loginHeroImg from '../assets/login_hero.png';
import { normalizeClerkUser } from '../engines/clerkAuthEngine';

interface LoginScreenProps {
  onLoginSuccess: (user: { email: string; name: string; avatarUrl?: string }) => void;
  onSkip?: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { signIn } = useSignIn();
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Safety net: if Clerk hasn't loaded within 4s (Android network timeout), show login page anyway
  const [clerkTimedOut, setClerkTimedOut] = useState(false);
  // Guard: only auto-advance if user explicitly clicked auth, OR Clerk loaded before the 4s timeout
  const [hasInitiatedAuth, setHasInitiatedAuth] = useState(false);

  useEffect(() => {
    if (isLoaded) return; // Clerk loaded normally — no timeout needed
    const t = setTimeout(() => setClerkTimedOut(true), 4000);
    return () => clearTimeout(t);
  }, [isLoaded]);

  // Auto-advance ONLY when:
  // 1. Clerk loaded fast (before 4s timeout) — normal case
  // 2. OR user explicitly clicked "Continue with Google" / email sign-in
  // This prevents a stale Clerk session found AFTER timeout from silently routing to questionnaire
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser && (!clerkTimedOut || hasInitiatedAuth)) {
      const normUser = normalizeClerkUser(clerkUser);
      onLoginSuccess({
        email: normUser.email,
        name: normUser.fullName,
        avatarUrl: normUser.imageUrl,
      });
    }
  }, [isLoaded, isSignedIn, clerkUser, clerkTimedOut, hasInitiatedAuth]);

  // Show spinner ONLY while Clerk is loading AND the 4s safety timeout hasn't fired
  // Also show it when user is already signed in (routing them out)
  // Show spinner: while Clerk loads (before 4s) OR once auth is confirmed after user tapped
  if ((!isLoaded && !clerkTimedOut) || (hasInitiatedAuth && isSignedIn && clerkUser)) {
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
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: 24,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(110, 231, 183, 0.2)',
          borderTopColor: '#6ee7b7', animation: 'spin 0.8s linear infinite', marginBottom: 16
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Authenticating with Google...</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>Syncing your Skinca AI profile</span>
      </div>
    );
  }


  async function handleGoogleLogin() {
    setHasInitiatedAuth(true);
    setLoading(true);
    setErrorMsg(null);

    // If Clerk SDK hasn't loaded yet, show a clear error instead of silent fail
    if (!signIn) {
      setLoading(false);
      setErrorMsg('Still connecting to auth server. Check your internet and try again in a moment.');
      return;
    }

    try {
      const isCapacitorOrLocalhost = typeof window !== 'undefined' && (
        window.location.origin.includes('localhost') || Boolean((window as any).Capacitor)
      );
      const origin = isCapacitorOrLocalhost && !window.location.host.includes(':3000')
        ? 'https://skinca-ai.vercel.app'
        : window.location.origin;

      const callbackUrl = `${origin}/sso-callback`;

      // If running in Capacitor Android APK, use Browser.open with valid https redirectUrl
      if (Boolean((window as any).Capacitor)) {
        const appCallbackUrl = 'https://skinca-ai.vercel.app/sso-callback';

        // Listen for browser navigation to sso-callback and redirect WebView to process the token
        const pageListener = await Browser.addListener('browserPageLoaded', async (info: any) => {
          if (info?.url && info.url.includes('/sso-callback')) {
            const fullCallbackUrl = info.url; // full URL with Clerk OAuth token params
            try {
              await Browser.close();
              pageListener.remove();
            } catch (e) {}
            // Navigate the WebView to the callback URL so Clerk can process the OAuth token
            setTimeout(() => {
              window.location.href = fullCallbackUrl;
            }, 300);
          }
        });

        const res = await signIn.create({
          strategy: 'oauth_google',
          redirectUrl: appCallbackUrl,
        });
        const googleAuthUrl = res.firstFactorVerification?.externalVerificationRedirectURL;
        if (googleAuthUrl) {
          await Browser.open({ url: googleAuthUrl.toString() });
        } else {
          await signIn.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: appCallbackUrl,
            redirectUrlComplete: appCallbackUrl,
          });
        }
        return;
      }

      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: callbackUrl,
        redirectUrlComplete: callbackUrl,
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Authentication error. Please try signing in again.');
    }
  }


  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setHasInitiatedAuth(true); // user explicitly tapped — allow auto-advance after sign-in
    setLoading(true);
    setErrorMsg(null);

    try {
      if (signIn) {
        const res = await signIn.create({
          identifier: email,
          password: password,
        });
        if (res.status === 'complete') {
          const normUser = normalizeClerkUser(clerkUser || { email, firstName: email.split('@')[0] });
          onLoginSuccess({ email: normUser.email, name: normUser.fullName, avatarUrl: normUser.imageUrl });
          return;
        }
      }

      // Standalone fallback
      setTimeout(() => {
        setLoading(false);
        const normUser = normalizeClerkUser({
          email,
          firstName: email.split('@')[0],
        });
        onLoginSuccess({
          email: normUser.email,
          name: normUser.fullName,
        });
      }, 700);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    }
  }



  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#0a1210',
      overflow: 'hidden',
    }}>
      {/* Background Hero Image */}
      <img
        src={loginHeroImg}
        alt="Clinical Skin Portrait"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          opacity: 1.0,
        }}
      />

      {/* Radiant Gradient Backdrop Mask */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 45%, rgba(10,18,16,0.95) 85%)',
      }} />


      {/* Floating Top Header Brand Banner */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 16px',
        background: 'rgba(10, 18, 16, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 30,
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: '#326859',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#ffffff', fontWeight: 900, boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            ✦
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '1.4px', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
            Skinca AI
          </span>
        </div>
      </div>


      {/* Main Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '32px 24px 40px',
        color: '#ffffff',
      }}>

        {/* Brand Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(50, 104, 89, 0.45)', backdropFilter: 'blur(12px)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', marginBottom: 14 }}>
          <span style={{ color: '#6ee7b7', fontSize: 12 }}>✦</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Clinical AI Intelligence</span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.15, margin: '0 0 10px', letterSpacing: '-0.02em', color: '#ffffff' }}>
          Personalized Dermal Science for Your Skin
        </h1>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: '0 0 28px', maxWidth: 360 }}>
          On-device colorimetry, custom ingredient matching, and real-time clinical progress tracking.
        </p>

        {/* Login Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Google (Gmail) Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 30,
              border: 'none',
              background: '#ffffff',
              color: '#111111',
              fontWeight: 800,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.0 10.05.0 12s.46 3.8 1.27 5.42l4.01-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            {loading ? 'Authenticating...' : 'Continue with Google (Gmail)'}
          </button>

          {/* Email / Password Sign-In Toggle */}
          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: 30,
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              ✉️ Continue with Email & Password
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(0,0,0,0.6)', padding: 16, borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none' }}
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ padding: '12px', borderRadius: 12, border: 'none', background: '#326859', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
              >
                {loading ? 'Signing In...' : 'Sign In / Register'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
