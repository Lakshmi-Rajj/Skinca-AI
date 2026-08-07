import React, { useState, useRef } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import type { JournalEntry } from '../types/mobile.types';
import { getResolvedUserAvatar } from '../utils/avatarUtils';
import {
  IconSmile, IconFrown, IconMeh, IconStar,
  IconEdit2, IconImage, IconX, IconSave, IconBookOpen, IconZap,
} from '../components/Icons';

type State = ReturnType<typeof useMobileState>;

// SVG-based status icons replacing emojis
const STATUS_ICON: Record<JournalEntry['skinStatus'], React.ReactNode> = {
  WORSE:      <IconFrown size={16} color="#dc2626" />,
  SAME:       <IconMeh size={16} color="#d97706" />,
  BETTER:     <IconSmile size={16} color="#326859" />,
  MUCH_BETTER:<IconStar size={16} color="#059669" fill="#059669" />,
};

const statusConfig: Record<JournalEntry['skinStatus'], { label: string; color: string; bg: string }> = {
  WORSE:      { label: 'Flaring',   color: '#dc2626', bg: '#fef2f2' },
  SAME:       { label: 'Stable',    color: '#d97706', bg: '#fef9c3' },
  BETTER:     { label: 'Improving', color: '#326859', bg: '#f0faf7' },
  MUCH_BETTER:{ label: 'Glowing',   color: '#059669', bg: '#ecfdf5' },
};

export function MySpaceJournalScreen({ state }: { state: State }) {
  const { journal, addJournalEntry, profile, lastScanResult } = state;
  const currentAvatar = getResolvedUserAvatar(profile, lastScanResult);
  const [showForm, setShowForm] = useState(false);
  const [skinStatus, setSkinStatus] = useState<JournalEntry['skinStatus']>('BETTER');
  const [notes, setNotes] = useState('');
  const [changes, setChanges] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bug 6 fix: wire photo capture — file input for web, also works via browser on native
  async function handlePhotoCapture() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!notes.trim()) return;
    addJournalEntry({
      skinStatus,
      notes,
      routineChanges: changes,
      photoPlaceholder: !!photoDataUrl,
      ...(photoDataUrl ? { photoUrl: photoDataUrl } : {}),
    });
    setNotes('');
    setChanges('');
    setPhotoDataUrl(null);
    setShowForm(false);
  }

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '18px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {currentAvatar ? (
            <img src={currentAvatar} alt="Profile" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #326859' }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eaf2ee', border: '2px solid #326859', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBookOpen size={22} color="#326859" />
            </div>
          )}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 2px', color: '#111' }}>Skin Journal</h2>
            <div style={{ fontSize: 11, color: '#888' }}>{profile.skinType} · {profile.primaryConcern}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* New entry button / form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: '100%', padding: '13px', borderRadius: 16, border: 'none',
              background: '#326859', color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', marginBottom: 14,
              boxShadow: '0 4px 14px rgba(50,104,89,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <IconEdit2 size={16} color="#fff" />
            Log Today's Entry
          </button>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, padding: '18px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
            {/* Form header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#111' }}>Today's Log</div>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <IconX size={18} color="#888" />
              </button>
            </div>

            {/* Skin status */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                How is your skin?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(['WORSE', 'SAME', 'BETTER', 'MUCH_BETTER'] as JournalEntry['skinStatus'][]).map(s => {
                  const cfg = statusConfig[s];
                  const sel = skinStatus === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSkinStatus(s)}
                      style={{
                        padding: '10px', borderRadius: 12,
                        border: sel ? `2px solid ${cfg.color}` : '1.5px solid #e0e0e0',
                        background: sel ? cfg.bg : '#fff',
                        color: sel ? cfg.color : '#666',
                        fontWeight: 700, fontSize: 12, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {STATUS_ICON[s]} {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo attachment — Bug 6 fix */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Photo (optional)
              </label>
              <input ref={fileInputRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={handleFileChange} />
              {photoDataUrl ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={photoDataUrl} alt="Skin photo" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', border: '2px solid #326859' }} />
                  <button
                    onClick={() => setPhotoDataUrl(null)}
                    style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    <IconX size={10} color="#fff" strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePhotoCapture}
                  style={{
                    padding: '8px 14px', borderRadius: 12, border: '1.5px dashed #b3ebd8',
                    background: '#f0faf7', color: '#326859', fontWeight: 600, fontSize: 12,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <IconImage size={14} color="#326859" />
                  Add Photo
                </button>
              )}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Observations
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Redness reduced, skin feels smooth..."
                rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #e0e0e0', fontSize: 13, outline: 'none', background: '#f8f9fa', boxSizing: 'border-box', resize: 'none', lineHeight: 1.5 }}
              />
            </div>

            {/* Product changes */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Products / Changes
              </label>
              <input
                value={changes}
                onChange={e => setChanges(e.target.value)}
                placeholder="e.g. Tried CeraVe PM moisturizer..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #e0e0e0', fontSize: 13, outline: 'none', background: '#f8f9fa', boxSizing: 'border-box' }}
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!notes.trim()}
              style={{
                width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                background: notes.trim() ? '#326859' : '#e0e0e0',
                color: notes.trim() ? '#fff' : '#aaa',
                fontWeight: 700, fontSize: 13, cursor: notes.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <IconSave size={15} color={notes.trim() ? '#fff' : '#aaa'} />
              Save Entry
            </button>
          </div>
        )}

        {/* History */}
        <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 10 }}>History</div>
        {journal.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '30px 20px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <IconBookOpen size={36} color="#b3ebd8" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>No Entries Yet</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Log your daily skin observations above</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {journal.map(entry => {
              const cfg = statusConfig[entry.skinStatus];
              const photo = (entry as any).photoUrl;
              return (
                <div key={entry.id} style={{ background: '#fff', borderRadius: 16, padding: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600 }}>{entry.date}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {STATUS_ICON[entry.skinStatus]} {cfg.label}
                    </span>
                  </div>
                  {photo && (
                    <img src={photo} alt="Skin" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }} />
                  )}
                  <div style={{ fontSize: 13, color: '#222', lineHeight: 1.5, marginBottom: 4 }}>{entry.notes}</div>
                  {entry.routineChanges && (
                    <div style={{ fontSize: 11, color: '#326859', fontWeight: 600, background: '#f0faf7', padding: '4px 10px', borderRadius: 8, marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <IconZap size={11} color="#326859" /> {entry.routineChanges}
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
