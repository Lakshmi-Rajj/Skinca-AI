import React from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

interface ResultsPageProps {
  onRestart: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onRestart }) => {
  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-stone-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Badge variant="success">Engine Match Score: 96%</Badge>
            <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">Engine v4.1 Verified</span>
          </div>
          <h1 className="font-serif text-4xl font-normal text-stone-900 mt-2">Your Personalized Skincare Protocol</h1>
          <p className="text-sm text-stone-600 font-light mt-1">Formulated for Combination skin targeting Acne & Hyperpigmentation.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRestart}>Re-run Assessment</Button>
      </header>

      {/* AI Clinical Rationale Banner */}
      <Card variant="bordered" className="bg-stone-100/60 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-stone-900 font-serif text-lg">
          <span>🤖 AI Clinical Rationale & Layering Analysis</span>
        </div>
        <p className="text-sm text-stone-700 font-light leading-relaxed">
          Your morning protocol combines Gentle Hydrating Cleanser and Niacinamide 10% to regulate sebum oxidation without disrupting lipid barrier balance, followed by broad-spectrum SPF 50 protection. Your evening protocol double-cleanses and applies Overnight Barrier Balm for cellular repair.
        </p>
      </Card>

      {/* Dual Protocol Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Morning Protocol Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-serif text-2xl font-normal text-stone-900 flex items-center gap-2">
              <span>☀️ Morning Protocol</span>
            </h3>
            <span className="text-xs font-mono uppercase tracking-wider text-stone-500">3 Steps</span>
          </div>

          <div className="space-y-4">
            <Card variant="default" className="p-5 flex gap-4 items-start border-l-4 border-l-amber-500">
              <span className="font-serif text-2xl font-light text-stone-400">01</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-medium text-stone-900">Gentle Hydrating Cleanser</h4>
                  <Badge variant="default">Cleanse</Badge>
                </div>
                <p className="text-xs text-stone-500 font-light">Cleanse with tepid water in the morning to preserve barrier lipids.</p>
                <div className="pt-2 text-xs font-mono text-emerald-700">✓ Safe for Daily AM Use</div>
              </div>
            </Card>

            <Card variant="default" className="p-5 flex gap-4 items-start border-l-4 border-l-amber-500">
              <span className="font-serif text-2xl font-light text-stone-400">02</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-medium text-stone-900">Niacinamide 10% + Zinc 1%</h4>
                  <Badge variant="default">Treat</Badge>
                </div>
                <p className="text-xs text-stone-500 font-light">Apply 2-3 drops to face prior to heavy creams.</p>
                <div className="pt-2 text-xs font-mono text-emerald-700">✓ Non-Conflicting Layering</div>
              </div>
            </Card>

            <Card variant="default" className="p-5 flex gap-4 items-start border-l-4 border-l-amber-500">
              <span className="font-serif text-2xl font-light text-stone-400">03</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-medium text-stone-900">Broad Spectrum Daily SPF 50</h4>
                  <Badge variant="default">Protect</Badge>
                </div>
                <p className="text-xs text-stone-500 font-light">Generous layer applied 15 minutes before UV exposure.</p>
                <div className="pt-2 text-xs font-mono text-emerald-700">✓ Essential Barrier Protection</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Evening Protocol Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-serif text-2xl font-normal text-stone-900 flex items-center gap-2">
              <span>🌙 Evening Protocol</span>
            </h3>
            <span className="text-xs font-mono uppercase tracking-wider text-stone-500">2 Steps</span>
          </div>

          <div className="space-y-4">
            <Card variant="default" className="p-5 flex gap-4 items-start border-l-4 border-l-indigo-600">
              <span className="font-serif text-2xl font-light text-stone-400">01</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-medium text-stone-900">Gentle Hydrating Cleanser</h4>
                  <Badge variant="default">Cleanse</Badge>
                </div>
                <p className="text-xs text-stone-500 font-light">Double cleanse to thoroughly dissolve SPF and environmental impurities.</p>
                <div className="pt-2 text-xs font-mono text-emerald-700">✓ Safe for Daily PM Use</div>
              </div>
            </Card>

            <Card variant="default" className="p-5 flex gap-4 items-start border-l-4 border-l-indigo-600">
              <span className="font-serif text-2xl font-light text-stone-400">02</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-medium text-stone-900">Overnight Barrier Recovery Balm</h4>
                  <Badge variant="default">Nourish</Badge>
                </div>
                <p className="text-xs text-stone-500 font-light">Smooth rich layer overnight to seal transepidermal water loss.</p>
                <div className="pt-2 text-xs font-mono text-emerald-700">✓ Barrier Lipid Support</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
