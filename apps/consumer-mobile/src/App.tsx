import React, { useState } from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

export function App() {
  const [activeTab, setActiveTab] = useState<'routine' | 'scanner' | 'tracker' | 'compatibility' | 'ai'>('routine');
  const [amDone, setAmDone] = useState(false);
  const [pmDone, setPmDone] = useState(false);

  // Scanner state
  const [scanQuery, setScanQuery] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

  // Compatibility state
  const [prodA, setProdA] = useState('Niacinamide 10% Serum');
  const [prodB, setProdB] = useState('Retinol 0.5% Night Oil');

  // AI Assistant state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChat, setAiChat] = useState([
    { sender: 'assistant', text: 'Hello! I am your AI Skincare Assistant. Ask me anything about your routine, ingredient safety, or layering instructions.' },
  ]);

  const handleScan = () => {
    setScanResult({
      name: scanQuery || 'Hydrating Facial Cleanser',
      inci: 'Water, Glycerin, Cetearyl Alcohol, Ceramide NP, Hyaluronic Acid',
      safety: 'HIGH_SAFETY',
      compatibility: 'Compatible with your Combination skin profile',
    });
  };

  const handleAiAsk = () => {
    if (!aiQuestion.trim()) return;
    setAiChat((prev) => [
      ...prev,
      { sender: 'user', text: aiQuestion },
      {
        sender: 'assistant',
        text: `Based on your Combination skin profile and active Acne concerns: ${aiQuestion} - Your current Niacinamide 10% serum works synergistically with your morning moisturizer without causing barrier irritation.`,
      },
    ]);
    setAiQuestion('');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-stone-800">
      {/* Mobile Top Status Header */}
      <header className="px-6 pt-6 pb-4 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Personal Companion</span>
          <h1 className="font-serif text-2xl font-normal text-stone-50">AURA Mobile</h1>
        </div>
        <Badge variant="success">Companion v1.0</Badge>
      </header>

      {/* Main Screen Views */}
      <main className="p-6 flex-grow space-y-6 overflow-y-auto">
        {/* VIEW 1: DAILY ROUTINE & PROFILE */}
        {activeTab === 'routine' && (
          <div className="space-y-6">
            <Card variant="bordered" className="bg-stone-900/60 p-5 border-stone-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400">Active Profile</span>
                <Badge variant="default">Combination</Badge>
              </div>
              <p className="text-xs text-stone-300 font-light">Targeting: Acne & Hyperpigmentation • Moderate Sensitivity</p>
            </Card>

            {/* Morning Routine Card */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl text-stone-100 flex items-center gap-2">☀️ Morning Routine</h3>
                <button
                  onClick={() => setAmDone(!amDone)}
                  className={`text-xs px-3 py-1 font-mono uppercase border transition-all ${
                    amDone ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-stone-900 text-stone-400 border-stone-700'
                  }`}
                >
                  {amDone ? '✓ Logged Complete' : 'Mark Complete'}
                </button>
              </div>
              <Card variant="default" className="bg-stone-900 border-stone-800 p-4 space-y-2">
                <div className="text-sm font-serif font-medium text-stone-100">1. Gentle Hydrating Cleanser</div>
                <div className="text-sm font-serif font-medium text-stone-100">2. Niacinamide 10% + Zinc 1%</div>
                <div className="text-sm font-serif font-medium text-stone-100">3. Broad Spectrum Daily SPF 50</div>
              </Card>
            </div>

            {/* Evening Routine Card */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl text-stone-100 flex items-center gap-2">🌙 Evening Routine</h3>
                <button
                  onClick={() => setPmDone(!pmDone)}
                  className={`text-xs px-3 py-1 font-mono uppercase border transition-all ${
                    pmDone ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-stone-900 text-stone-400 border-stone-700'
                  }`}
                >
                  {pmDone ? '✓ Logged Complete' : 'Mark Complete'}
                </button>
              </div>
              <Card variant="default" className="bg-stone-900 border-stone-800 p-4 space-y-2">
                <div className="text-sm font-serif font-medium text-stone-100">1. Double Cleanser</div>
                <div className="text-sm font-serif font-medium text-stone-100">2. Overnight Barrier Balm</div>
              </Card>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCT & BARCODE SCANNER */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-stone-100">Product & INCI Scanner</h2>
            <Card variant="bordered" className="bg-stone-900 p-5 border-stone-800 space-y-4">
              <label className="block text-xs font-mono uppercase text-stone-400">Search Product or Paste INCI Ingredients</label>
              <input
                type="text"
                value={scanQuery}
                onChange={(e) => setScanQuery(e.target.value)}
                placeholder="e.g. Niacinamide, Salicylic Acid, Product Barcode"
                className="w-full bg-stone-950 border border-stone-800 p-3 text-sm text-stone-100 focus:outline-none focus:border-stone-500"
              />
              <Button variant="primary" size="md" className="w-full" onClick={handleScan}>
                🔍 Scan Ingredients
              </Button>
            </Card>

            {scanResult && (
              <Card variant="default" className="bg-stone-900 border-stone-800 p-5 space-y-3">
                <h4 className="font-serif text-lg text-stone-100">{scanResult.name}</h4>
                <div className="text-xs font-mono text-stone-400">INCI: {scanResult.inci}</div>
                <Badge variant="success">{scanResult.compatibility}</Badge>
              </Card>
            )}
          </div>
        )}

        {/* VIEW 3: ROUTINE TRACKER & JOURNAL */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-stone-100">Progress Journal & Tracker</h2>
            <Card variant="bordered" className="bg-stone-900 p-5 border-stone-800 space-y-4">
              <span className="text-xs font-mono uppercase text-stone-400">Weekly Routine Adherence</span>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono">
                <div className="p-2 bg-emerald-950 text-emerald-300 border border-emerald-700">M</div>
                <div className="p-2 bg-emerald-950 text-emerald-300 border border-emerald-700">T</div>
                <div className="p-2 bg-emerald-950 text-emerald-300 border border-emerald-700">W</div>
                <div className="p-2 bg-emerald-950 text-emerald-300 border border-emerald-700">T</div>
                <div className="p-2 bg-emerald-950 text-emerald-300 border border-emerald-700">F</div>
                <div className="p-2 bg-stone-950 text-stone-500 border border-stone-800">S</div>
                <div className="p-2 bg-stone-950 text-stone-500 border border-stone-800">S</div>
              </div>
              <p className="text-xs text-stone-400">5 out of 7 days logged complete this week.</p>
            </Card>
          </div>
        )}

        {/* VIEW 4: COMPATIBILITY CHECKER */}
        {activeTab === 'compatibility' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-stone-100">Product Compatibility Checker</h2>
            <Card variant="bordered" className="bg-stone-900 p-5 border-stone-800 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-stone-400">Product A</label>
                <input
                  type="text"
                  value={prodA}
                  onChange={(e) => setProdA(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 p-3 text-sm text-stone-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-stone-400">Product B</label>
                <input
                  type="text"
                  value={prodB}
                  onChange={(e) => setProdB(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 p-3 text-sm text-stone-100"
                />
              </div>
              <Badge variant="warning">⚠️ Caution: Alternate AM/PM usage recommended</Badge>
              <p className="text-xs text-stone-400">Do not apply Niacinamide 10% and High-Dose Retinol at the exact same moment to avoid barrier irritation.</p>
            </Card>
          </div>
        )}

        {/* VIEW 5: AI SKINCARE ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-stone-100">AI Skincare Assistant</h2>
            <div className="h-64 overflow-y-auto bg-stone-900 p-4 border border-stone-800 space-y-3">
              {aiChat.map((msg, idx) => (
                <div key={idx} className={`p-3 text-xs rounded-none ${msg.sender === 'user' ? 'bg-stone-800 text-stone-100 self-end ml-8' : 'bg-stone-950 text-stone-300 border border-stone-800 mr-8'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask about ingredients or layering..."
                className="flex-grow bg-stone-900 border border-stone-800 p-3 text-xs text-stone-100"
              />
              <Button variant="primary" size="sm" onClick={handleAiAsk}>Send</Button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="border-t border-stone-800 bg-stone-900 px-3 py-3 flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-stone-400">
        <button onClick={() => setActiveTab('routine')} className={`flex flex-col items-center gap-1 ${activeTab === 'routine' ? 'text-emerald-400 font-bold' : ''}`}>
          <span>📋</span>
          <span>Routine</span>
        </button>
        <button onClick={() => setActiveTab('scanner')} className={`flex flex-col items-center gap-1 ${activeTab === 'scanner' ? 'text-emerald-400 font-bold' : ''}`}>
          <span>🔍</span>
          <span>Scanner</span>
        </button>
        <button onClick={() => setActiveTab('tracker')} className={`flex flex-col items-center gap-1 ${activeTab === 'tracker' ? 'text-emerald-400 font-bold' : ''}`}>
          <span>📈</span>
          <span>Tracker</span>
        </button>
        <button onClick={() => setActiveTab('compatibility')} className={`flex flex-col items-center gap-1 ${activeTab === 'compatibility' ? 'text-emerald-400 font-bold' : ''}`}>
          <span>⚡</span>
          <span>Check</span>
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-emerald-400 font-bold' : ''}`}>
          <span>🤖</span>
          <span>AI Assist</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
