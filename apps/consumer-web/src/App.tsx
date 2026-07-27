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
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Navbar Container */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
            <span className="font-serif text-2xl font-normal tracking-tight text-stone-900">AURA</span>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Dermatology</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <button onClick={goHome} className={`hover:text-stone-900 ${activeTab === 'landing' ? 'text-stone-900 underline' : 'text-stone-600'}`}>Home</button>
            <button onClick={startAssessment} className={`hover:text-stone-900 ${activeTab === 'wizard' ? 'text-stone-900 underline' : 'text-stone-600'}`}>Skin Assessment</button>
            <button onClick={showResults} className={`hover:text-stone-900 ${activeTab === 'results' ? 'text-stone-900 underline' : 'text-stone-600'}`}>My Routine</button>
            <button onClick={() => setActiveTab('profile')} className={`hover:text-stone-900 ${activeTab === 'profile' ? 'text-stone-900 underline' : 'text-stone-600'}`}>Profile</button>
            <Button variant="primary" size="sm" onClick={startAssessment}>Start Assessment</Button>
          </div>
        </div>
      </nav>

      {/* Page Views Router */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {activeTab === 'landing' && <LandingPage onStartAssessment={startAssessment} />}
        {activeTab === 'wizard' && <AssessmentPage onComplete={showResults} />}
        {activeTab === 'results' && <ResultsPage onRestart={startAssessment} />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === '404' && <NotFoundPage onGoHome={goHome} />}
      </main>
    </div>
  );
}

export default App;
