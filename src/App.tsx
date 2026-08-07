import React, { useState, useEffect } from 'react';
import { useUser, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Toaster, toast } from 'react-hot-toast';
import { useMobileState } from './hooks/useMobileState';
import { normalizeClerkUser } from './engines/clerkAuthEngine';



import { LoginScreen }                 from './pages/LoginScreen';
import { OnboardingScreen }            from './pages/OnboardingScreen';
import { ScanScreen }                  from './pages/ScanScreen';
import { SkinAnalysisDashboard }       from './pages/SkinAnalysisDashboard';
import { SkinAnalysisMapScreen }       from './pages/SkinAnalysisMapScreen';
import { PersonalizedRoutineScreen }    from './pages/PersonalizedRoutineScreen';
import { RecommendedIngredientsScreen } from './pages/RecommendedIngredientsScreen';
import { RecommendedProductsScreen }    from './pages/RecommendedProductsScreen';
import { ProgressTrackerScreen }       from './pages/ProgressTrackerScreen';
import { SkinAgeDiagnosticScreen }     from './pages/SkinAgeDiagnosticScreen';
import { SkinAIChatScreen }            from './pages/SkinAIChatScreen';
import { RecommendationRationaleScreen } from './pages/RecommendationRationaleScreen';
import { DiscoverCatalogScreen }       from './pages/DiscoverCatalogScreen';
import { LayeringCompatibilityScreen } from './pages/LayeringCompatibilityScreen';
import { MySpaceJournalScreen }        from './pages/MySpaceJournalScreen';
import { ProfileScreen }               from './pages/ProfileScreen';
import { ProPaywallModal }             from './components/ProPaywallModal';
import { ProductDetailScreen }         from './pages/ProductDetailScreen';


type Tab =
  | 'sso-callback' | 'login' | 'onboarding' | 'scan' | 'dashboard' | 'map' | 'routine'
  | 'ingredients' | 'shop' | 'tracker' | 'age' | 'chat'
  | 'rationale' | 'discover' | 'layering' | 'journal' | 'profile' | 'pro' | 'product-detail';



const NAV_SCREENS = [
  { id: 'login', label: 'Welcome & Login 🔐' },
  { id: 'onboarding', label: 'Start Questionnaire' },
  { id: 'scan', label: 'AI Face Scanner 📸' },
  { id: 'dashboard', label: 'Home Dashboard' },
  { id: 'map', label: 'Skin Analysis Map 🗺️' },
  { id: 'routine', label: 'Routine' },
  { id: 'shop', label: 'Shop Recommendations' },
  { id: 'ingredients', label: 'Ingredients Guide' },
  { id: 'tracker', label: 'Progress Tracker' },
  { id: 'age', label: 'Skin Age Diagnostic' },
  { id: 'chat', label: 'Ask Skin AI' },
  { id: 'rationale', label: 'Why This Recommendation' },
  { id: 'layering', label: 'Layering Checker' },
  { id: 'journal', label: 'Skin Journal' },
  { id: 'profile', label: 'My Profile' },
  { id: 'pro', label: '✦ Skinca PRO' },
];


// SVG icons for bottom nav matching reference design
function NavIcon({ id, active }: { id: string; active: boolean }) {
  const c = active ? '#326859' : '#b0b0b0';
  const sw = '1.8';
  if (id === 'dashboard') return <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if (id === 'routine') return <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  if (id === 'scan') return <svg width={22} height={22} viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  if (id === 'shop') return <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
  if (id === 'profile') return <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  return null;
}

const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Home' },
  { id: 'routine', label: 'Routine' },
  { id: 'scan', label: 'Analysis' },
  { id: 'shop', label: 'Shop' },
  { id: 'profile', label: 'Profile' },
];

// SSO Callback screen — handles both web and Android APK deep-link flows
function SSOCallbackScreen({ onTimeout }: { onTimeout: () => void }) {
  const [timedOut, setTimedOut] = React.useState(false);
  const isAndroid = React.useMemo(() => /Android/i.test(navigator.userAgent), []);

  React.useEffect(() => {
    if (isAndroid) {
      // Android Chrome (opened from APK via Browser.open) — trigger native deep-link
      const nativeUrl = 'com.skinca.ai://sso-callback' + window.location.search + window.location.hash;
      window.location.href = nativeUrl;
      // If APK not installed, fall back to login after 2.5s
      const t = setTimeout(() => { setTimedOut(true); onTimeout(); }, 2500);
      return () => clearTimeout(t);
    } else {
      // Desktop / iOS: give Clerk plenty of time to process the handshake
      const t = setTimeout(() => { setTimedOut(true); onTimeout(); }, 25000);
      return () => clearTimeout(t);
    }
  }, [isAndroid, onTimeout]);

  if (isAndroid) {
    return (
      <div style={{ minHeight: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a1210', color: '#ffffff', fontFamily: 'system-ui, sans-serif', padding: 24, textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(110, 231, 183, 0.2)', borderTopColor: '#6ee7b7', animation: 'spin 0.8s linear infinite', marginBottom: 16 }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Opening Skinca AI...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a1210', color: '#ffffff', fontFamily: 'system-ui, sans-serif', padding: 24, textAlign: 'center' }}>
      {!timedOut && (
        <>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(110, 231, 183, 0.2)', borderTopColor: '#6ee7b7', animation: 'spin 0.8s linear infinite', marginBottom: 16 }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Finalizing Google Authentication...</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6, marginBottom: 20 }}>Completing secure token handshake with Clerk</span>
          <AuthenticateWithRedirectCallback
            afterSignInUrl={window.location.origin}
            afterSignUpUrl={window.location.origin + '?new_signup=1'}
            signInForceRedirectUrl={window.location.origin}
            signUpForceRedirectUrl={window.location.origin + '?new_signup=1'}
          />
        </>
      )}
    </div>
  );
}


export default function App() {
  let clerkUser: any = null;
  let isSignedIn: boolean | undefined = false;
  let isLoaded: boolean = true;

  try {
    const clerkAuth = useUser();
    clerkUser = clerkAuth.user;
    isSignedIn = clerkAuth.isSignedIn;
    isLoaded = clerkAuth.isLoaded;
  } catch (e) {
    console.warn('Clerk useUser context safely caught on init:', e);
  }

  const state = useMobileState();

  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/sso-callback') || window.location.search.includes('__clerk'))) {
      return 'sso-callback';
    }
    return 'login';
  });

  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [showProModal, setShowProModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  // Track if Clerk loaded AFTER the login page was already shown (>4s boot)
  // When true, don't auto-route from login — let the user explicitly tap sign-in
  const appBootTime = React.useRef(Date.now());
  const [clerkLoadedLate, setClerkLoadedLate] = useState(false);

  React.useEffect(() => {
    if (!isLoaded) return;
    const elapsed = Date.now() - appBootTime.current;
    if (elapsed > 3500) setClerkLoadedLate(true); // Clerk was slow — login page was already visible
  }, [isLoaded]);


  // Handles session expiry & Clerk Cloud Metadata onboarding sync
  useEffect(() => {
    if (!isLoaded) return;

    // ── FAST PATH: isSignedIn is true but we're stuck on sso-callback (web/Vercel) ──
    // clerkUser may not have loaded yet — don't wait, navigate immediately using local state
    if (isSignedIn && tab === 'sso-callback' && !clerkUser) {
      const localDone = state.profile.onboardingDone;
      const isNewSignup = typeof window !== 'undefined' && window.location.search.includes('new_signup=1');
      window.history.replaceState({}, '', '/');
      if (isNewSignup) { setTab('onboarding'); return; }
      const next = localDone ? 'dashboard' : 'onboarding';
      setTab(next);
      if (next === 'dashboard') setUnlocked(true);
      return;
    }

    if (isSignedIn && clerkUser) {
      const norm = normalizeClerkUser(clerkUser);
      state.updateProfile({
        isLoggedIn: true,
        avatarUrl: norm.imageUrl || state.profile.avatarUrl
      });

      if (tab === 'login' || tab === 'sso-callback') {
        // If Clerk loaded LATE (after 4s timeout, login page was already visible to the user),
        // do NOT auto-route — wait for user to explicitly tap "Continue with Google"
        if (clerkLoadedLate && tab === 'login') return;

        toast.success(`Welcome, ${norm.fullName}! Signed in successfully.`, {
          id: 'auth-success-toast',
          duration: 4500,
          position: 'top-center',
          style: {
            background: '#0a1210',
            color: '#ffffff',
            border: '1px solid rgba(110, 231, 183, 0.4)',
            borderRadius: '20px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
            fontSize: '13px',
            fontWeight: '700',
            padding: '12px 20px',
          },
          iconTheme: {
            primary: '#6ee7b7',
            secondary: '#0a1210',
          },
        });

        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/sso-callback')) {
          window.history.replaceState({}, '', '/');
        }

        // Check if this is a brand new sign-up (tagged with ?new_signup=1)
        const isNewSignup = typeof window !== 'undefined' && window.location.search.includes('new_signup=1');
        if (isNewSignup) {
          // Clean up the URL param
          window.history.replaceState({}, '', '/');
          // Always send new users to onboarding
          setTab('onboarding');
          return;
        }

        // Check Clerk cloud metadata FIRST (cross-device), then fall back to local storage
        const clerkDone = !!(clerkUser?.unsafeMetadata?.onboardingDone);
        const localDone = state.profile.onboardingDone;
        const onboardingDone = clerkDone || localDone;

        // Sync to local state if Clerk cloud says done but local memory doesn't know yet
        if (clerkDone && !localDone) {
          state.updateProfile({ onboardingDone: true });
        }

        const next = onboardingDone ? 'dashboard' : 'onboarding';
        setTab(next);
        if (next === 'dashboard') setUnlocked(true);
      }
    } else if (!isSignedIn) {
      // Session expired OR user never logged in — force return to login screen
      if (tab !== 'login' && tab !== 'sso-callback') {
        state.updateProfile({ isLoggedIn: false });
        setUnlocked(false);
        setTab('login');
        if (tab === 'onboarding' || tab === 'dashboard') {
          toast('Session ended. Please sign in again.', {
            icon: '🔐',
            style: { background: '#1a1a1a', color: '#fff', borderRadius: '20px' },
            position: 'top-center',
          });
        }
      }
    }
  }, [isLoaded, isSignedIn, clerkUser, tab, clerkLoadedLate]);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && (window.innerWidth <= 768 || Boolean((window as any).Capacitor))
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768 || Boolean((window as any).Capacitor));
    };
    window.addEventListener('resize', handleResize);

    // Handle incoming deep links safely when returning from Google OAuth in Chrome
    let listenerPromise: any = null;
    try {
      if (typeof window !== 'undefined' && Boolean((window as any).Capacitor)) {
        listenerPromise = CapApp.addListener('appUrlOpen', (event) => {
          try { Browser.close().catch(() => {}); } catch (e) {}

          // Handle com.skinca.ai://sso-callback?... deep link from Vercel OAuth redirect
          if (event.url.includes('sso-callback') || event.url.includes('__clerk')) {
            // Extract the query string from the deep link URL
            const urlObj = new URL(event.url);
            const params = urlObj.search; // e.g. ?code=...&__clerk_status=...

            // Patch window.location so AuthenticateWithRedirectCallback can process the token
            if (params) {
              window.history.replaceState({}, '', '/sso-callback' + params);
            }
            setTab('sso-callback');
          }
        });
      }
    } catch (e) {
      console.warn('CapApp listener init skipped:', e);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (listenerPromise && typeof listenerPromise.then === 'function') {
        listenerPromise.then((l: any) => l?.remove?.()).catch(() => {});
      }
    };
  }, []);

  // Schedule daily 8 AM & 8 PM skincare reminders — only ONCE, after user signs in
  React.useEffect(() => {
    if (!isSignedIn) return; // Don't ask for permission until user is signed in

    async function scheduleDailyReminders() {
      try {
        if (!Boolean((window as any).Capacitor)) return; // Only in APK, not browser

        // Check if already scheduled — skip if so (don't ask again every session)
        const pending = await LocalNotifications.getPending();
        const alreadyScheduled = pending.notifications.some(n => n.id === 801 || n.id === 802);
        if (alreadyScheduled) return;

        // Request notification permission (only first time after sign-in)
        const { display } = await LocalNotifications.requestPermissions();
        if (display !== 'granted') return;

        const now = new Date();

        // Read user's saved times (default: 8 AM and 8 PM)
        const savedMorning = localStorage.getItem('skinca_morning_time') || '08:00';
        const savedEvening = localStorage.getItem('skinca_evening_time') || '20:00';

        const [mH, mM] = savedMorning.split(':').map(Number);
        const [eH, eM] = savedEvening.split(':').map(Number);

        // Build next morning time
        const morning = new Date(now);
        morning.setHours(mH, mM, 0, 0);
        if (morning <= now) morning.setDate(morning.getDate() + 1);

        // Build next evening time
        const evening = new Date(now);
        evening.setHours(eH, eM, 0, 0);
        if (evening <= now) evening.setDate(evening.getDate() + 1);

        await LocalNotifications.schedule({
          notifications: [
            {
              id: 801,
              title: '✨ Morning Skincare Reminder',
              body: 'Start your day right — apply your morning routine now! 🌿',
              schedule: { at: morning, repeats: true, every: 'day' },
              sound: undefined,
              smallIcon: 'ic_launcher_round',
              iconColor: '#326859',
            },
            {
              id: 802,
              title: '🌙 Evening Skincare Reminder',
              body: 'Time for your evening skincare routine! Your skin will thank you. 💚',
              schedule: { at: evening, repeats: true, every: 'day' },
              sound: undefined,
              smallIcon: 'ic_launcher_round',
              iconColor: '#326859',
            },
          ],
        });
      } catch (e) {
        console.warn('Notification scheduling skipped:', e);
      }
    }
    scheduleDailyReminders();
  }, [isSignedIn]); // Triggers only when sign-in state changes to true

  // ── Ask notification permission when user enters onboarding ──────────────
  React.useEffect(() => {
    if (tab !== 'onboarding') return;

    async function askNotificationPermission() {
      try {
        if (Boolean((window as any).Capacitor)) {
          // Native Android/iOS — Capacitor LocalNotifications
          const { display } = await LocalNotifications.requestPermissions();
          if (display === 'granted') {
            toast('Reminders enabled — we\'ll keep your routine on track!', {
              style: { background: '#326859', color: '#fff', borderRadius: '20px', fontWeight: 600 },
              position: 'top-center',
              duration: 3000,
            });
          }
        } else if ('Notification' in window && Notification.permission === 'default') {
          // Web browser — native Notification API
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            toast('Reminders enabled!', {
              style: { background: '#326859', color: '#fff', borderRadius: '20px', fontWeight: 600 },
              position: 'top-center',
              duration: 3000,
            });
          }
        }
      } catch (e) {
        console.warn('Notification permission request skipped:', e);
      }
    }

    // Small delay so the onboarding screen is fully visible before the dialog pops
    const timer = setTimeout(askNotificationPermission, 1500);
    return () => clearTimeout(timer);
  }, [tab]);


  function navigate(id: string) {
    setDrawerOpen(false);
    if (id === 'pro') { setShowProModal(true); return; }

    // Guard: Questionnaire is NEVER accessible without being signed in
    if (id === 'onboarding' && !isSignedIn) {
      toast('Please sign in first to start the questionnaire.', {
        icon: '🔐',
        style: { background: '#1a1a1a', color: '#fff', borderRadius: '20px' },
        position: 'top-center',
      });
      setTab('login');
      return;
    }

    setTab(id as Tab);
    if (id === 'login' || id === 'onboarding') {
      setUnlocked(false);
    } else {
      setUnlocked(true);
    }
  }


  const outerContainerStyle: React.CSSProperties = isMobile
    ? {
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }
    : {
        minHeight: '100vh',
        background: '#e8e8ee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        padding: '16px 0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      };

  const viewportContainerStyle: React.CSSProperties = isMobile
    ? {
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        minHeight: '100%',
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
      }
    : {
        width: '100%',
        maxWidth: 430,
        height: '92vh',
        maxHeight: 880,
        borderRadius: 24,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
      };

  return (
    <div style={outerContainerStyle}>

      {/* Mobile Viewport Container */}
      <div style={viewportContainerStyle}>


        {/* ─── TOP HEADER BAR (Only visible on Home Dashboard & main app screens) ─── */}
        {tab !== 'login' && tab !== 'onboarding' && (
          <header style={{
            background: '#ffffff',
            borderBottom: '1px solid #f0f0f0',
            padding: '14px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, zIndex: 60,
          }}>
            {/* Hamburger Menu Icon */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 4.5 }}
              aria-label="Open menu"
            >
              <span style={{ display: 'block', width: 20, height: 2, background: '#111111', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 14, height: 2, background: '#111111', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 20, height: 2, background: '#111111', borderRadius: 2 }} />
            </button>

            {/* Skinca AI Brand Logo */}
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: '#111111' }}>Skinca AI</span>

            {/* Bell Notifications Button */}
            <button
              onClick={() => navigate('chat')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, position: 'relative' }}
              aria-label="Notifications"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          </header>
        )}


        {/* ─── DRAWER OVERLAY MENU ─── */}
        {drawerOpen && (
          <>
            <div
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 70 }}
            />
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 270,
              background: '#ffffff', zIndex: 80, display: 'flex', flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
            }}>
              <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: '#111111' }}>Skinca AI</span>
                <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#888888', padding: 0, lineHeight: 1 }}>×</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {NAV_SCREENS.map(m => {
                  const isActive = tab === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => navigate(m.id)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '13px 20px',
                        border: 'none', background: isActive ? '#f0faf7' : 'transparent',
                        cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#326859' : '#444444',
                        borderLeft: isActive ? '3px solid #326859' : '3px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
                <button onClick={() => navigate('pro')} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: '#326859', color: '#ffffff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  ✦ Upgrade to PRO
                </button>
              </div>
            </div>
          </>
        )}

        {/* ─── MAIN CONTENT VIEWPORT ─── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
          {tab === 'sso-callback' && (
            <SSOCallbackScreen onTimeout={() => setTab('login')} />
          )}

          {tab === 'login'        && (

            <LoginScreen
              onLoginSuccess={(u) => {
                state.updateProfile({ isLoggedIn: true, avatarUrl: u.avatarUrl || state.profile.avatarUrl });
                const clerkDone = !!(clerkUser?.unsafeMetadata?.onboardingDone);
                const localDone = state.profile.onboardingDone;
                const onboardingDone = clerkDone || localDone;
                if (clerkDone && !localDone) state.updateProfile({ onboardingDone: true });
                const next = onboardingDone ? 'dashboard' : 'onboarding';
                setTab(next);
                if (next === 'dashboard') setUnlocked(true);
              }}
              onSkip={undefined}
            />
          )}

          {tab === 'onboarding'   && <OnboardingScreen onComplete={async (data) => {
            state.completeOnboarding(data);
            if (clerkUser) {
              try {
                await clerkUser.update({ unsafeMetadata: { onboardingDone: true } });
              } catch (e) {
                console.warn('Clerk metadata sync warning:', e);
              }
            }
            if (data.analysisMode === 'QUESTIONNAIRE_ONLY') { setTab('dashboard'); setUnlocked(true); } else { setTab('scan'); }
          }} />}

          {tab === 'scan'        && <ScanScreen state={state} onScanComplete={() => { setTab('dashboard'); setUnlocked(true); }} />}
          {tab === 'dashboard'   && <SkinAnalysisDashboard state={state} onNavigate={setTab as any} />}
          {tab === 'map'         && <SkinAnalysisMapScreen state={state} />}
          {tab === 'routine'     && <PersonalizedRoutineScreen state={state} />}
          {tab === 'ingredients' && <RecommendedIngredientsScreen state={state} />}
          {tab === 'shop'        && <RecommendedProductsScreen state={state} />}
          {tab === 'tracker'     && <ProgressTrackerScreen state={state} />}
          {tab === 'age'         && <SkinAgeDiagnosticScreen state={state} />}
          {tab === 'chat'        && <SkinAIChatScreen state={state} />}
          {tab === 'rationale'   && <RecommendationRationaleScreen state={state} />}
          {tab === 'discover'    && <DiscoverCatalogScreen state={state} onViewProduct={(id) => { setSelectedProductId(id); setTab('product-detail'); }} />}

          {tab === 'layering'    && <LayeringCompatibilityScreen state={state} />}
          {tab === 'journal'     && <MySpaceJournalScreen state={state} />}
          {tab === 'profile'     && <ProfileScreen state={state} onNavigate={setTab as any} />}
          {tab === 'product-detail' && (() => {
            const { CATALOG_DATA } = require('./engines/catalog.data');
            const prod = CATALOG_DATA.find((p: any) => p.id === selectedProductId);
            return prod
              ? <ProductDetailScreen product={prod} state={state} onBack={() => setTab('discover')} />
              : null;
          })()}

        </div>

        {/* ─── BOTTOM NAVIGATION BAR ─── */}
        {unlocked && tab !== 'onboarding' && tab !== 'login' && (

          <nav style={{ background: '#ffffff', borderTop: '1px solid #ebebeb', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 8px 22px', flexShrink: 0, zIndex: 40 }}>
            {BOTTOM_NAV.map(n => {
              const isActive = tab === n.id;
              const isCenter = n.id === 'scan';
              return (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id as Tab)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: 'none', transform: isCenter ? 'translateY(-14px)' : 'none', padding: '0 8px', gap: 3 }}
                >
                  {isCenter ? (
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#326859', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(50,104,89,0.4)', border: '3px solid #ffffff' }}>
                      <NavIcon id="scan" active={true} />
                    </div>
                  ) : (
                    <NavIcon id={n.id} active={isActive} />
                  )}
                  <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? '#326859' : '#b0b0b0', marginTop: isCenter ? 5 : 0 }}>{n.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* PRO Subscription Modal */}
        {showProModal && <ProPaywallModal onClose={() => setShowProModal(false)} />}

        {/* Global Toast Notification Container */}
        <Toaster />
      </div>
    </div>
  );
}

