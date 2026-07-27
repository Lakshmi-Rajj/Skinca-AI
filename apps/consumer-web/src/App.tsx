import React, { useState } from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'wizard' | 'results' | 'profile'>('landing');
  const [step, setStep] = useState(1);

  const [skinType, setSkinType] = useState('COMBINATION');
  const [primaryConcern, setPrimaryConcern] = useState('acne');
  const [secondaryConcern, setSecondaryConcern] = useState('hyperpigmentation');
  const [sensitivity, setSensitivity] = useState('MODERATE');
  const [isPregnant, setIsPregnant] = useState(false);
  const [allergies, setAllergies] = useState('Fragrance');

  const startAssessment = () => {
    setActiveTab('wizard');
    setStep(1);
  };

  const handleCompleteAssessment = () => {
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <span className="font-serif text-2xl font-normal tracking-tight text-stone-900">AURA</span>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Dermatology</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <button onClick={() => setActiveTab('landing')} className={`hover:text-stone-900 ${activeTab === 'landing' ? 'text-stone-900 underline' : 'text-stone-600'}`}>Home</button>
            <button onClick={startAssessment} className={`hover:text-stone-900 ${activeTab === 'wizard' ? 'text-stone-900 underline' : 'text-stone-600'}`}>Skin Assessment</button>
            <button onClick={() => setActiveTab('results')} className={`hover:text-stone-900 ${activeTab === 'results' ? 'text-stone-900 underline' : 'text-stone-600'}`}>My Routine</button>
            <button onClick={() => setActiveTab('profile')} className={`hover:text-stone-900 ${activeTab === 'profile' ? 'text-stone-900 underline' : 'text-stone-600'}`}>Profile</button>
            <Button variant="primary" size="sm" onClick={startAssessment}>Start Assessment</Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {activeTab === 'landing' && (
          <div className="space-y-16">
            <section className="text-center max-w-3xl mx-auto py-12">
              <Badge variant="default">Deterministic Clinical Intelligence</Badge>
              <h1 className="mt-6 font-serif text-5xl font-normal text-stone-900 leading-tight">
                Dermatologist-Grade Precision Skincare Analysis
              </h1>
              <p className="mt-4 text-lg text-stone-600 font-light">
                Discover your personalized morning and evening routine backed by scientific formulation mapping and deterministic clinical rules.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button variant="primary" size="lg" onClick={startAssessment}>Take 2-Min Skin Assessment</Button>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card variant="bordered" className="p-8">
                <h3 className="font-serif text-xl font-medium text-stone-900">10-Stage Deterministic Pipeline</h3>
                <p className="mt-2 text-sm text-stone-600">Zero AI guesswork. Every product recommendation passes strict skin barrier and contraindication verification.</p>
              </Card>
              <Card variant="bordered" className="p-8">
                <h3 className="font-serif text-xl font-medium text-stone-900">Scientific INCI Mapping</h3>
                <p className="mt-2 text-sm text-stone-600">We analyze exact active concentrations, pH compatibility, and synergistic ingredient pairings.</p>
              </Card>
              <Card variant="bordered" className="p-8">
                <h3 className="font-serif text-xl font-medium text-stone-900">AI Explanation Worker</h3>
                <p className="mt-2 text-sm text-stone-600">Understand the exact scientific reasoning behind every product assigned to your morning and night routines.</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'wizard' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex justify-between items-center text-sm font-medium text-stone-500">
              <span>Assessment Step {step} of 3</span>
              <span>{step === 1 ? '33%' : step === 2 ? '66%' : '100%'} Completed</span>
            </div>

            <Card variant="default" className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-normal text-stone-900">Step 1: Your Skin Profile</h2>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Skin Type</label>
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      className="w-full rounded-md border border-stone-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                    >
                      <option value="DRY">Dry Skin</option>
                      <option value="OILY">Oily Skin</option>
                      <option value="COMBINATION">Combination Skin</option>
                      <option value="SENSITIVE">Sensitive Skin</option>
                      <option value="NORMAL">Normal Skin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Skin Sensitivity Level</label>
                    <select
                      value={sensitivity}
                      onChange={(e) => setSensitivity(e.target.value)}
                      className="w-full rounded-md border border-stone-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                    >
                      <option value="LOW">Low Sensitivity</option>
                      <option value="MODERATE">Moderate Sensitivity</option>
                      <option value="HIGH">High Sensitivity / Rosacea Prone</option>
                    </select>
                  </div>
                  <Button variant="primary" size="md" className="w-full" onClick={() => setStep(2)}>Continue to Concerns →</Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-normal text-stone-900">Step 2: Target Skin Concerns</h2>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Primary Skin Concern</label>
                    <select
                      value={primaryConcern}
                      onChange={(e) => setPrimaryConcern(e.target.value)}
                      className="w-full rounded-md border border-stone-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                    >
                      <option value="acne">Acne & Active Blemishes</option>
                      <option value="hyperpigmentation">Hyperpigmentation & Dark Spots</option>
                      <option value="redness">Redness & Inflammation</option>
                      <option value="wrinkles">Fine Lines & Loss of Firmness</option>
                      <option value="dehydration">Dehydration & Dullness</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="md" className="w-1/2" onClick={() => setStep(1)}>← Back</Button>
                    <Button variant="primary" size="md" className="w-1/2" onClick={() => setStep(3)}>Continue to Safety →</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-normal text-stone-900">Step 3: Safety & Allergies</h2>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="pregnancy"
                      checked={isPregnant}
                      onChange={(e) => setIsPregnant(e.target.checked)}
                      className="h-4 w-4 rounded border-stone-300"
                    />
                    <label htmlFor="pregnancy" className="text-sm text-stone-700">I am currently pregnant or nursing</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Known Allergies / Sensitivities</label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Fragrance, Nuts, Sulfates"
                      className="w-full rounded-md border border-stone-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="md" className="w-1/2" onClick={() => setStep(2)}>← Back</Button>
                    <Button variant="primary" size="md" className="w-1/2" onClick={handleCompleteAssessment}>Generate Custom Routine ✨</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-12">
            <header className="flex justify-between items-end border-b border-stone-200 pb-6">
              <div>
                <Badge variant="success">Engine Match Score: 96%</Badge>
                <h1 className="font-serif text-3xl font-normal text-stone-900 mt-2">Your Personalized Skincare Protocol</h1>
                <p className="text-sm text-stone-500 mt-1">Formulated for {skinType} skin targeting {primaryConcern}.</p>
              </div>
              <Button variant="outline" size="sm" onClick={startAssessment}>Re-run Assessment</Button>
            </header>

            <Card variant="bordered" className="bg-stone-100/50 p-6">
              <div className="flex items-center gap-2 text-stone-900 font-medium text-sm">
                <span>🤖 AI Clinical Rationale</span>
              </div>
              <p className="mt-2 text-sm text-stone-700 leading-relaxed">
                Your morning routine utilizes Gentle Hydrating Cleanser and Vitamin C to neutralize daily oxidants while protecting barrier lipids with broad-spectrum SPF 50. Your evening routine double-cleanses and applies Niacinamide 10% for cell recovery.
              </p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-2">
                  <span>☀️ Morning Protocol</span>
                </h3>
                <Card variant="default" className="p-4 flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Gentle Hydrating Cleanser</h4>
                    <p className="text-xs text-stone-500">Cleanse • Apply warm water morning</p>
                  </div>
                </Card>
                <Card variant="default" className="p-4 flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Niacinamide 10% + Zinc Serum</h4>
                    <p className="text-xs text-stone-500">Treat • Apply 2-3 drops after cleansing</p>
                  </div>
                </Card>
                <Card variant="default" className="p-4 flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Broad Spectrum Daily SPF 50</h4>
                    <p className="text-xs text-stone-500">Protect • Final AM barrier layer</p>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-2">
                  <span>🌙 Evening Protocol</span>
                </h3>
                <Card variant="default" className="p-4 flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Gentle Hydrating Cleanser</h4>
                    <p className="text-xs text-stone-500">Cleanse • Double cleanse night</p>
                  </div>
                </Card>
                <Card variant="default" className="p-4 flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Overnight Barrier Recovery Balm</h4>
                    <p className="text-xs text-stone-500">Nourish • Apply rich night layer</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="font-serif text-3xl font-normal text-stone-900">Customer Profile & Assessment History</h1>
            <Card variant="bordered" className="p-6">
              <h3 className="font-serif text-lg font-medium text-stone-900 mb-4">Active Profile Parameters</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-stone-500">Skin Type:</span> <strong className="text-stone-900">{skinType}</strong></div>
                <div><span className="text-stone-500">Primary Concern:</span> <strong className="text-stone-900">{primaryConcern}</strong></div>
                <div><span className="text-stone-500">Sensitivity Level:</span> <strong className="text-stone-900">{sensitivity}</strong></div>
                <div><span className="text-stone-500">Pregnancy Status:</span> <strong className="text-stone-900">{isPregnant ? 'Yes' : 'No'}</strong></div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
