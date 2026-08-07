import React, { useRef, useState, useEffect } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import { getResolvedUserAvatar } from '../utils/avatarUtils';
import { LocalNotifications } from '@capacitor/local-notifications';

type State = ReturnType<typeof useMobileState>;

function generateWeeklyScores(tracker: State['tracker']): number[] {
  const weeks: number[] = [];
  for (let w = 3; w >= 0; w--) {
    let total = 0, count = 0;
    for (let d = 0; d < 7; d++) {
      const date = new Date();
      date.setDate(date.getDate() - (w * 7 + d));
      const iso = date.toISOString().slice(0, 10);
      const entry = tracker.find(t => t.date === iso);
      if (entry) total += ((entry.amCompleted ? 1 : 0) + (entry.pmCompleted ? 1 : 0)) / 2 * 100;
      count++;
    }
    weeks.push(count > 0 ? Math.round(total / count) : 0);
  }
  return weeks;
}

function getWeeklyProgressScores(tracker: State['tracker'], lastScanResult: State['lastScanResult']): (number | string)[] {
  if (!lastScanResult) {
    return ['—', '—', '—', '—'];
  }
  const baseScore = lastScanResult.overallScore;
  const rawTrackerScores = generateWeeklyScores(tracker);
  return rawTrackerScores.map((adherence, idx) => {
    if (idx === 3) return baseScore;
    const diff = (3 - idx) * 3;
    const adj = Math.round(baseScore - diff + (adherence * 0.05));
    return Math.max(30, Math.min(99, adj));
  });
}



function ReminderSettings() {
  const [morningTime, setMorningTime] = useState(() => localStorage.getItem('skinca_morning_time') || '08:00');
  const [eveningTime, setEveningTime] = useState(() => localStorage.getItem('skinca_evening_time') || '20:00');
  const [saved, setSaved] = useState(false);
  const [notifSupported] = useState(() => Boolean((window as any).Capacitor));

  async function handleSave() {
    localStorage.setItem('skinca_morning_time', morningTime);
    localStorage.setItem('skinca_evening_time', eveningTime);

    if (notifSupported) {
      try {
        // Cancel existing reminders
        const pending = await LocalNotifications.getPending();
        const toCancel = pending.notifications.filter(n => n.id === 801 || n.id === 802);
        if (toCancel.length > 0) await LocalNotifications.cancel({ notifications: toCancel });

        const now = new Date();

        // Parse morning time
        const [mH, mM] = morningTime.split(':').map(Number);
        const morning = new Date(now);
        morning.setHours(mH, mM, 0, 0);
        if (morning <= now) morning.setDate(morning.getDate() + 1);

        // Parse evening time
        const [eH, eM] = eveningTime.split(':').map(Number);
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
        console.warn('Rescheduling notifications failed:', e);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function formatDisplay(time24: string) {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  return (
    <div style={{ background: '#ffffff', borderRadius: 20, padding: '16px 18px', border: '1px solid #eeeeee', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>⏰</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111111' }}>Skincare Reminders</div>
          <div style={{ fontSize: 11, color: '#888888', marginTop: 1 }}>Set your daily reminder times</div>
        </div>
      </div>

      {/* Morning Time Picker */}
      <div style={{ background: '#f9fbfb', borderRadius: 14, padding: '12px 14px', marginBottom: 10, border: '1px solid #edf4f2' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🌅</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>Morning Reminder</div>
              <div style={{ fontSize: 11, color: '#888888' }}>Currently: {formatDisplay(morningTime)}</div>
            </div>
          </div>
          <input
            type="time"
            value={morningTime}
            onChange={e => setMorningTime(e.target.value)}
            style={{
              border: '1.5px solid #326859',
              borderRadius: 10,
              padding: '6px 10px',
              fontSize: 14,
              fontWeight: 700,
              color: '#326859',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* Evening Time Picker */}
      <div style={{ background: '#f9fbfb', borderRadius: 14, padding: '12px 14px', marginBottom: 14, border: '1px solid #edf4f2' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🌙</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>Evening Reminder</div>
              <div style={{ fontSize: 11, color: '#888888' }}>Currently: {formatDisplay(eveningTime)}</div>
            </div>
          </div>
          <input
            type="time"
            value={eveningTime}
            onChange={e => setEveningTime(e.target.value)}
            style={{
              border: '1.5px solid #326859',
              borderRadius: 10,
              padding: '6px 10px',
              fontSize: 14,
              fontWeight: 700,
              color: '#326859',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 14,
          border: 'none',
          background: saved ? '#22c55e' : '#326859',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: 13,
          cursor: 'pointer',
          transition: 'background 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {saved ? (
          <><span>✅</span><span>Reminders Saved!</span></>
        ) : (
          <><span>💾</span><span>Save Reminder Times</span></>
        )}
      </button>

      {!notifSupported && (
        <div style={{ marginTop: 10, fontSize: 11, color: '#888888', textAlign: 'center' }}>
          ℹ️ Times saved. Install the app to receive notifications.
        </div>
      )}
    </div>
  );
}

export function ProfileScreen({ state, onNavigate }: { state: State; onNavigate: (tab: string) => void }) {
  const { profile, weeklyAdherence, savedIds, journal, tracker, lastScanResult, updateProfile } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAvatar = getResolvedUserAvatar(profile, lastScanResult);
  const weeklyScores = getWeeklyProgressScores(tracker, lastScanResult);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateProfile({ avatarUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Improvement text: if we have a scan result, show real metrics; otherwise prompt for first scan
  const improvementText = lastScanResult
    ? `Score: ${lastScanResult.overallScore}/100 • 💧 Hydration ${lastScanResult.hydration}% • 🔴 Redness ${lastScanResult.redness}%`
    : 'Complete your first AI scan to see your 30-day progress';

  return (
    <div style={{ background: '#ffffff', minHeight: '100%', paddingBottom: 90, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* User Banner Header */}
      <div style={{ padding: '20px 20px 16px', background: '#f9fbfb', borderBottom: '1px solid #edf4f2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          
          {/* Avatar with Camera Upload Overlay */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt="User profile avatar"
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #326859' }}
              />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#eaf2ee', border: '3px solid #326859',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
              }}>
                👤
              </div>
            )}

            <div style={{
              position: 'absolute', bottom: 0, right: 0, background: '#326859', color: '#ffffff',
              width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 11, border: '2px solid #ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}>
              📷
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111111', margin: 0 }}>My Skin Profile</h1>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ background: 'none', border: 'none', color: '#326859', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Edit Photo
              </button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              <span style={{ background: '#326859', color: '#ffffff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12 }}>
                {profile.gender || 'FEMALE'}
              </span>
              <span style={{ background: '#eaf2ee', color: '#326859', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12 }}>
                {profile.skinType} SKIN
              </span>
              <span style={{ background: '#eaf2ee', color: '#326859', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12 }}>
                {profile.primaryConcern.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>


      <div style={{ padding: '16px 20px 0' }}>
        
        {/* Quick Activity Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: '#f9fbfb', borderRadius: 16, padding: '12px 10px', textAlign: 'center', border: '1px solid #edf4f2' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#326859' }}>{weeklyAdherence.currentStreak}d</div>
            <div style={{ fontSize: 10, color: '#888888', fontWeight: 600, marginTop: 2 }}>Streak 🔥</div>
          </div>
          <div style={{ background: '#f9fbfb', borderRadius: 16, padding: '12px 10px', textAlign: 'center', border: '1px solid #edf4f2' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#326859' }}>{savedIds.length}</div>
            <div style={{ fontSize: 10, color: '#888888', fontWeight: 600, marginTop: 2 }}>Saved 🛍️</div>
          </div>
          <div style={{ background: '#f9fbfb', borderRadius: 16, padding: '12px 10px', textAlign: 'center', border: '1px solid #edf4f2' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#326859' }}>{journal.length}</div>
            <div style={{ fontSize: 10, color: '#888888', fontWeight: 600, marginTop: 2 }}>Entries 📖</div>
          </div>
        </div>

        {/* PROMINENT PROGRESS GRAPH CARD IN PROFILE */}
        <div
          onClick={() => onNavigate('tracker')}
          style={{
            background: 'linear-gradient(135deg, #f0faf7 0%, #e6f4ef 100%)',
            borderRadius: 20,
            padding: '16px 18px',
            border: '1.5px solid #326859',
            boxShadow: '0 4px 16px rgba(50,104,89,0.08)',
            marginBottom: 16,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#326859', textTransform: 'uppercase', letterSpacing: 1 }}>
                30-DAY SKIN PROGRESS GRAPH 📊
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#111111', marginTop: 2 }}>
                Track Your Progress
              </div>
            </div>
            <span style={{ background: '#326859', color: '#ffffff', fontSize: 11, fontWeight: 800, padding: '6px 12px', borderRadius: 16 }}>
              View Graph ›
            </span>
          </div>

          {/* Mini Weekly Score Cards Preview */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {weeklyScores.map((sc, i) => (
              <div key={i} style={{ flex: 1, background: i === 3 ? '#326859' : '#ffffff', borderRadius: 10, padding: '8px 4px', textAlign: 'center', border: i === 3 ? 'none' : '1px solid #b3ebd8' }}>
                <div style={{ fontSize: 9, color: i === 3 ? '#ffffff' : '#888888', fontWeight: 600 }}>W{i + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: i === 3 ? '#ffffff' : '#111111' }}>{sc}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: '#2d6a4f', fontWeight: 600 }}>
            {improvementText}
          </div>
        </div>

        {/* Clinical Profile Parameters Grid */}
        <div style={{ background: '#ffffff', borderRadius: 20, padding: '16px 18px', border: '1px solid #eeeeee', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111111', marginBottom: 12 }}>Clinical Parameters</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Gender', val: profile.gender || 'FEMALE' },
              { label: 'Skin Type', val: profile.skinType },
              { label: 'Primary Concern', val: profile.primaryConcern },
              { label: 'Sensitivity', val: profile.sensitivity },
              { label: 'Age Range', val: profile.ageRange },
              { label: 'Climate Environment', val: profile.climate },
              { label: 'Budget Tier', val: profile.budget },
            ].map(item => (

              <div key={item.label} style={{ background: '#f9fbfb', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#888888', textTransform: 'uppercase', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111111', marginTop: 2 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Quick Menu List */}
        <div style={{ fontSize: 14, fontWeight: 800, color: '#111111', marginBottom: 10 }}>Account & Tools</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'tracker', icon: '📊', label: 'Progress Tracker & Graph', desc: 'Detailed 30-day skin score analytics' },
            { id: 'age', icon: '⏳', label: 'Your Skin Age', desc: 'Chronological vs AI Skin Age (34 vs 29)' },
            { id: 'ingredients', icon: '🧪', label: 'Recommended Ingredients', desc: 'Ingredients to use vs avoid' },
            { id: 'journal', icon: '📖', label: 'My Skin Journal', desc: 'Log daily skin condition & photos' },
            { id: 'layering', icon: '⚖️', label: 'Layering Compatibility', desc: 'Check active ingredient safety' },
            { id: 'rationale', icon: '💡', label: 'AI Recommendation Rationale', desc: 'View full clinical logic' },
            { id: 'chat', icon: '🤖', label: 'Ask Your Skin AI', desc: '24/7 AI dermatologist assistant' },
            { id: 'pro', icon: '✦', label: 'Skinca PRO Membership', desc: 'Manage premium features' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: '12px 16px',
                border: '1px solid #eeeeee',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111111' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#888888', marginTop: 1 }}>{item.desc}</div>
              </div>
              <span style={{ color: '#cccccc', fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>

        {/* ⏰ Reminder Settings Card */}
        <ReminderSettings />

        {/* Sign Out / Reset Session Button */}
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <button
            onClick={async () => {
              try {
                const clerk = (window as any).Clerk;
                if (clerk && clerk.signOut) {
                  await clerk.signOut();
                }
              } catch (e) {}
              try {
                localStorage.clear();
              } catch (e) {}
              state.updateProfile({ isLoggedIn: false, onboardingDone: false });
              onNavigate('login');
            }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 16,
              border: '1px solid #fee2e2',
              background: '#fff5f5',
              color: '#dc2626',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>🚪</span>
            <span>Sign Out & Return to Login Screen</span>
          </button>
        </div>


      </div>
    </div>
  );
}

