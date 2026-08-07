import React, { useState, useRef, useEffect } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import type { ChatMessage } from '../types/mobile.types';

type State = ReturnType<typeof useMobileState>;

// Face for AI avatar
const AI_AVATAR = '🤖';

const POPULAR_QUESTIONS = [
  'Why do I have redness?',
  'Can I use retinol?',
  'Is this product suitable for me?',
  'Compare these two serums',
];

export function SkinAIChatScreen({ state }: { state: State }) {
  const { sendChatMessage, profile } = state;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      sender: 'assistant',
      text: `Hi! I'm Skinica AI — your personal skin intelligence. I know you have ${profile.skinType.toLowerCase()} skin with a focus on ${profile.primaryConcern}. Ask me anything!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = text ?? input;
    if (!msg.trim() || loading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: msg, timestamp: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const reply = await sendChatMessage(msg);
      setMessages(m => [...m, { id: Date.now().toString() + '_ai', sender: 'assistant', text: reply, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages(m => [...m, { id: 'err', sender: 'assistant', text: 'Sorry, I had trouble connecting. Please try again.', timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f7faf9' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '16px 20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px', color: '#111' }}>Ask Your Skin AI</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 11, color: '#888' }}>Powered by Skinica AI</span>
        </div>
      </div>

      {/* Popular Questions */}
      {messages.length <= 1 && (
        <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Popular Questions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {POPULAR_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 25, padding: '10px 16px', fontSize: 13, color: '#333', cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', fontWeight: 500 }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {msg.sender === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#326859', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                🌿
              </div>
            )}
            <div style={{
              maxWidth: '78%',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: msg.sender === 'user' ? '#326859' : '#fff',
              color: msg.sender === 'user' ? '#fff' : '#111',
              fontSize: 13,
              lineHeight: 1.6,
              boxShadow: msg.sender === 'assistant' ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#326859', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌿</div>
            <div style={{ padding: '12px 16px', borderRadius: '20px 20px 20px 4px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#ccc', animation: `pulse ${0.6 + i * 0.15}s ease-in-out infinite alternate` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 16px 32px', background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about your skin..."
          style={{ flex: 1, padding: '12px 18px', borderRadius: 30, border: '1.5px solid #e8e8e8', fontSize: 13, outline: 'none', background: '#f8f9fa' }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', background: input.trim() ? '#326859' : '#e8e8e8', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#fff' : '#bbb'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
