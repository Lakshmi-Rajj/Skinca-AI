import React, { useState } from 'react';
import { Button } from '@platform/ui-components';
import { LandingPage } from './pages/LandingPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'wizard' | 'results' | 'profile' | '404'>('landing');

  const startAssessment = () => setActiveTab('wizard');
  const showResults = () => setActiveTab('results');
  const goHome = () => setActiveTab('landing');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans flex flex-col justify-between">
      {/* Sticky Luxury Navbar */}
      <nav className="border-b border-stone-200 bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
            <span className="font-serif text-3xl font-normal tracking-tight text-stone-900">AURA</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-mono border-l border-stone-300 pl-3">Clinical Science</span>
          </div>

          <div className="flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-stone-600">
            <button
              onClick={goHome}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'landing' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-1' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={startAssessment}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'wizard' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-1' : ''}`}
            >
              Diagnostic Wizard
            </button>
            <button
              onClick={showResults}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'results' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-1' : ''}`}
            >
              My Protocol
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'profile' ? 'text-stone-900 font-semibold border-b-2 border-stone-900 pb-1' : ''}`}
            >
              Account Profile
            </button>
            <Button variant="primary" size="sm" onClick={startAssessment}>
              Start Assessment
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Router */}
      <main className="mx-auto max-w-7xl px-6 py-10 flex-grow w-full">
        {activeTab === 'landing' && <LandingPage onStartAssessment={startAssessment} />}
        {activeTab === 'wizard' && <AssessmentPage onComplete={showResults} />}
        {activeTab === 'results' && <ResultsPage onRestart={startAssessment} />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === '404' && <NotFoundPage onGoHome={goHome} />}
      </main>

      {/* Luxury Editorial Footer */}
      <footer className="border-t border-stone-200 bg-stone-900 text-stone-300 py-12 mt-20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="font-serif text-2xl text-stone-50 font-normal">AURA Dermatology</span>
            <p className="text-xs text-stone-400 font-light mt-1">Deterministic Clinical Skincare Recommendation Infrastructure.</p>
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
            © 2026 AURA Dermatology Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
