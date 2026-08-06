import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import type { JournalEntry } from '../types/mobile.types';
import { getResolvedUserAvatar } from '../utils/avatarUtils';

type State = ReturnType<typeof useMobileState>;

export function MySpaceJournalScreen({ state }: { state: State }) {
  const { journal, addJournalEntry, profile, lastScanResult } = state;
  const currentAvatar = getResolvedUserAvatar(profile, lastScanResult);
  const [showForm, setShowForm] = useState(false);
  const [skinStatus, setSkinStatus] = useState<JournalEntry['skinStatus']>('BETTER');
  const [notes, setNotes] = useState('');
  const [changes, setChanges] = useState('');

  function handleSave() {
    if (!notes.trim()) return;
    addJournalEntry({ skinStatus, notes, routineChanges: changes, photoPlaceholder: true });
    setNotes('');
    setChanges('');
    setShowForm(false);
  }

  const statusConfig: Record<JournalEntry['skinStatus'], { label: string; color: string; bg: string; emoji: string }> = {
    WORSE: { label: 'Flaring Up', color: '#dc2626', bg: '#fef2f2', emoji: '😔' },
    SAME: { label: 'Stable', color: '#d97706', bg: '#fef9c3', emoji: '😐' },
    BETTER: { label: 'Improving', color: '#326859', bg: '#f0faf7', emoji: '😊' },
    MUCH_BETTER: { label: 'Glowing', color: '#059669', bg: '#ecfdf5', emoji: '🌟' },
  };

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* User Header Profile */}
      <div style={{ background: '#fff', padding: '18px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {currentAvatar ? (
            <img src={currentAvatar} alt="User profile" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: '2px solid #326859' }} />
          ) : (
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#eaf2ee', border: '2px solid #326859', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              👤
            </div>
          )}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 2px', color: '#111' }}>My Skin Journal</h2>
            <div style={{ fontSize: 12, color: '#888' }}>{profile.skinType} Skin · {profile.primaryConcern}</div>
          </div>
        </div>
      </div>


      <div style={{ padding: '14px 16px' }}>
        {/* New Entry Button / Form Toggle */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: '100%', padding: '14px', borderRadius: 16, border: 'none',
              background: '#326859', color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', marginBottom: 14, boxShadow: '0 4px 14px rgba(50,104,89,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <span>✍️</span> Log Today's Skin Entry
          </button>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, padding: '18px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#111' }}>Log Today's Status</div>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>How is your skin feeling?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(['WORSE', 'SAME', 'BETTER', 'MUCH_BETTER'] as JournalEntry['skinStatus'][]).map(s => {
                  const cfg = statusConfig[s];
                  const sel = skinStatus === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSkinStatus(s)}
                      style={{
                        padding: '10px', borderRadius: 12, border: sel ? `2px solid ${cfg.color}` : '1px solid #e0e0e0',
                        background: sel ? cfg.bg : '#fff', color: sel ? cfg.color : '#555',
                        fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                      }}
                    >
                      <span>{cfg.emoji}</span> {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Skin Notes & Observations</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Redness reduced around cheeks, skin feels hydrated..."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 13, outline: 'none', background: '#f8f9fa', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Products Used / Routine Changes</label>
              <input
                value={changes}
                onChange={e => setChanges(e.target.value)}
                placeholder="e.g. Introduced CeraVe PM moisturizer..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 13, outline: 'none', background: '#f8f9fa', boxSizing: 'border-box' }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!notes.trim()}
              style={{
                width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                background: notes.trim() ? '#326859' : '#ccc', color: '#fff',
                fontWeight: 700, fontSize: 13, cursor: notes.trim() ? 'pointer' : 'default',
              }}
            >
              Save Entry
            </button>
          </div>
        )}

        {/* History List */}
        <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 10 }}>Journal History</div>
        {journal.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '30px 20px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📖</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>No Entries Logged Yet</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Log your daily observations to track progress over time.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {journal.map(entry => {
              const cfg = statusConfig[entry.skinStatus];
              return (
                <div key={entry.id} style={{ background: '#fff', borderRadius: 16, padding: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{entry.date}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{cfg.emoji}</span> {cfg.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: '#222', lineHeight: 1.5, marginBottom: 4 }}>{entry.notes}</div>
                  {entry.routineChanges && (
                    <div style={{ fontSize: 11, color: '#326859', fontWeight: 600, background: '#f0faf7', padding: '4px 8px', borderRadius: 8, marginTop: 6, display: 'inline-block' }}>
                      ⚡ {entry.routineChanges}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
