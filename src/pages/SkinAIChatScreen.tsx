import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import type { ChatMessage } from '../types/mobile.types';

type State = ReturnType<typeof useMobileState>;

const STORAGE_KEY = 'skinca_chat_history';

/* ── Personalized quick questions based on skin profile ── */
function getPersonalizedQuestions(skinType: string, concern: string): string[] {
  const base: Record<string, string[]> = {
    oily: [
      'Best moisturizer for oily skin?',
      'How to control shine and sebum?',
      'Can I skip moisturizer if my skin is oily?',
      'Best face wash for oily skin?',
      'Does niacinamide help oily skin?',
    ],
    dry: [
      'Best hydrating serum for dry skin?',
      'How do I stop skin from flaking?',
      'Should I use hyaluronic acid or glycerin?',
      'Best night cream for dry skin?',
      'Is oil cleansing good for dry skin?',
    ],
    combination: [
      'How to balance combination skin?',
      'Should I use two different moisturizers?',
      'Best toner for combination skin?',
      'Why is my T-zone oily but cheeks dry?',
      'Can I use niacinamide on combination skin?',
    ],
    sensitive: [
      'Which ingredients should I avoid?',
      'Can I use retinol on sensitive skin?',
      'Best calming serum for redness?',
      'How to patch test a new product?',
      'Is centella asiatica good for my skin?',
    ],
  };
  const concernQuestions: Record<string, string> = {
    acne: 'How to fade acne scars fast?',
    aging: 'Best anti-aging ingredients to use?',
    hyperpigmentation: 'How to treat dark spots at home?',
    redness: 'What calms redness and rosacea?',
    dullness: 'How to get glowing skin quickly?',
    pores: 'How to minimize large pores?',
  };

  const key = skinType.toLowerCase();
  const questions = [...(base[key] || base['combination'])];
  const cq = concernQuestions[concern.toLowerCase()];
  if (cq && !questions.includes(cq)) questions.unshift(cq);
  return questions.slice(0, 4);
}

/* ── Follow-up suggestions after AI replies ── */
const FOLLOWUP_POOL: string[][] = [
  ['Tell me more', 'Which product do you recommend?', 'Is this safe for daily use?'],
  ['What ingredients should I look for?', 'Any side effects?', 'How long to see results?'],
  ['Can I use this with retinol?', 'Best time to apply — AM or PM?', 'Budget-friendly options?'],
  ['Is this suitable for my skin type?', 'How do I layer this correctly?', 'Show me a routine using this'],
];

function getFollowups(): string[] {
  return FOLLOWUP_POOL[Math.floor(Math.random() * FOLLOWUP_POOL.length)];
}

/* ── Render AI text with basic markdown ── */
function renderAIText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} style={{ fontWeight: 800, color: '#1a1a1a' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    // Bullet points
    if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
      return (
        <div key={i} style={{ display: 'flex', gap: 6, marginTop: i > 0 ? 4 : 0 }}>
          <span style={{ color: '#326859', fontWeight: 800, flexShrink: 0 }}>•</span>
          <span>{parts}</span>
        </div>
      );
    }
    return <div key={i} style={{ marginTop: i > 0 && line.trim() ? 6 : 0 }}>{parts}</div>;
  });
}

/* ── Format timestamp ── */
function formatTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

/* ── Greeting based on time of day ── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function SkinAIChatScreen({ state }: { state: State }) {
  const { sendChatMessage, profile } = state;

  const buildWelcome = useCallback((): ChatMessage => ({
    id: 'welcome',
    sender: 'assistant',
    text: `${getGreeting()}! I'm Skinica AI — your personal dermatology assistant ✨\n\nI know you have **${profile.skinType.toLowerCase()} skin** with a focus on **${profile.primaryConcern}**.\n\nAsk me anything about skincare, ingredients, routines, or products — I'm here 24/7!`,
    timestamp: new Date().toISOString(),
  }), [profile.skinType, profile.primaryConcern]);

  // Load from localStorage or init with welcome
  const [messages, setMessages] = useState<(ChatMessage & { followups?: string[] })[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [buildWelcome()];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage on every message change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const personalizedQs = getPersonalizedQuestions(profile.skinType, profile.primaryConcern);

  async function handleSend(text?: string) {
    const msg = text ?? input;
    if (!msg.trim() || loading) return;
    const userMsg: ChatMessage & { followups?: string[] } = {
      id: Date.now().toString(),
      sender: 'user',
      text: msg,
      timestamp: new Date().toISOString(),
    };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const reply = await sendChatMessage(msg);
      setMessages(m => [...m, {
        id: Date.now().toString() + '_ai',
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toISOString(),
        followups: getFollowups(),
      }]);
    } catch {
      setMessages(m => [...m, {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: 'Sorry, I had trouble connecting. Please try again! 🔄',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    const fresh = buildWelcome();
    setMessages([fresh]);
    setShowClearConfirm(false);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([fresh])); } catch {}
  }

  const isFirstMessage = messages.length <= 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f5f7f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e4d42 0%, #326859 100%)',
        padding: '14px 18px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 16px rgba(50,104,89,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* AI Avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            🌿
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>Skinica AI</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Online · Dermatology AI</span>
            </div>
          </div>
        </div>
        {/* Clear chat button */}
        <button
          onClick={() => setShowClearConfirm(true)}
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 20, padding: '6px 12px', color: '#ffffff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
        >
          Clear Chat
        </button>
      </div>

      {/* ── Clear Confirm Banner ── */}
      {showClearConfirm && (
        <div style={{ background: '#fff8ee', borderBottom: '1px solid #fed7aa', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>Clear all chat history?</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowClearConfirm(false)} style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: 8, padding: '4px 12px', fontSize: 12, cursor: 'pointer', color: '#555' }}>Cancel</button>
            <button onClick={handleClear} style={{ background: '#ef4444', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: 12, cursor: 'pointer', color: '#fff', fontWeight: 700 }}>Clear</button>
          </div>
        </div>
      )}

      {/* ── Personalized Quick Questions (shown only when chat is fresh) ── */}
      {isFirstMessage && (
        <div style={{ padding: '14px 16px 4px', flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            💡 Suggested for you
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {personalizedQs.map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2f0ec',
                  borderRadius: 14,
                  padding: '10px 12px',
                  fontSize: 12,
                  color: '#1e4d42',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  boxShadow: '0 2px 8px rgba(50,104,89,0.06)',
                  transition: 'all 0.15s',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages Area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>

        {messages.map((msg, idx) => (
          <div key={msg.id}>
            {/* Date separator — show date if first message or new day */}
            {idx === 0 && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <span style={{ background: '#e2e8e6', color: '#666', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  {new Date(msg.timestamp).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 8,
              marginBottom: 8,
              animation: 'slideIn 0.2s ease-out',
            }}>
              {/* AI Avatar */}
              {msg.sender === 'assistant' && (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e4d42, #326859)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(50,104,89,0.25)',
                }}>
                  🌿
                </div>
              )}

              <div style={{ maxWidth: '80%' }}>
                {/* Bubble */}
                <div style={{
                  padding: '11px 15px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #326859, #1e4d42)'
                    : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#1a1a1a',
                  fontSize: 13,
                  lineHeight: 1.65,
                  boxShadow: msg.sender === 'assistant'
                    ? '0 2px 12px rgba(0,0,0,0.07)'
                    : '0 2px 8px rgba(50,104,89,0.3)',
                }}>
                  {msg.sender === 'assistant' ? renderAIText(msg.text) : msg.text}
                </div>

                {/* Timestamp */}
                <div style={{
                  fontSize: 10, color: '#aaa', marginTop: 3,
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  paddingLeft: msg.sender === 'assistant' ? 4 : 0,
                  paddingRight: msg.sender === 'user' ? 4 : 0,
                }}>
                  {formatTime(msg.timestamp)}
                </div>

                {/* Follow-up suggestion chips */}
                {msg.sender === 'assistant' && msg.followups && idx === messages.length - 1 && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {msg.followups.map(fq => (
                      <button
                        key={fq}
                        onClick={() => handleSend(fq)}
                        style={{
                          background: '#f0faf7',
                          border: '1.5px solid #c6e8de',
                          borderRadius: 20,
                          padding: '7px 14px',
                          fontSize: 12,
                          color: '#326859',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontWeight: 600,
                          display: 'inline-block',
                          alignSelf: 'flex-start',
                          transition: 'all 0.15s',
                        }}
                      >
                        {fq} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ── Typing Indicator ── */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e4d42, #326859)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0,
            }}>🌿</div>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 4px',
              background: '#ffffff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#326859',
                    opacity: 0.6,
                    animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* ── Input Bar ── */}
      <div style={{
        padding: '10px 14px 28px',
        background: '#ffffff',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flexShrink: 0,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.04)',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask anything about your skin..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: 30,
            border: '1.5px solid',
            borderColor: input.trim() ? '#326859' : '#e8e8e8',
            fontSize: 13,
            outline: 'none',
            background: '#f8f9fa',
            color: '#111',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            border: 'none',
            background: input.trim() && !loading
              ? 'linear-gradient(135deg, #326859, #1e4d42)'
              : '#e8e8e8',
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: input.trim() && !loading ? '0 4px 12px rgba(50,104,89,0.35)' : 'none',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke={input.trim() && !loading ? '#fff' : '#bbb'} strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* ── Animations ── */}
      <style>{`
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
