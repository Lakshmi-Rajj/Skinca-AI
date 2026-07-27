import React from 'react';
import { Button, Card } from '@platform/ui-components';
import { useAssessment } from '../hooks/useAssessment';

interface AssessmentPageProps {
  onComplete: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onComplete }) => {
  const { step, answers, updateAnswers, nextStep, prevStep } = useAssessment();

  const skinTypes = [
    { id: 'DRY', title: 'Dry Skin', desc: 'Tightness, flaking, or dull texture needing hydration' },
    { id: 'OILY', title: 'Oily Skin', desc: 'Excess sebum, shine, and prone to clogged pores' },
    { id: 'COMBINATION', title: 'Combination Skin', desc: 'Oily T-zone (forehead, nose) with normal/dry cheeks' },
    { id: 'SENSITIVE', title: 'Sensitive Skin', desc: 'Easily irritated, reactive to active formulations' },
  ];

  const concerns = [
    { id: 'acne', title: 'Acne & Active Blemishes', desc: 'Breakouts, blackheads, and clogged pores' },
    { id: 'hyperpigmentation', title: 'Hyperpigmentation & Dark Spots', desc: 'Sun damage, melasma, and post-acne marks' },
    { id: 'redness', title: 'Redness & Rosacea', desc: 'Inflammation, flushing, and delicate skin barrier' },
    { id: 'wrinkles', title: 'Fine Lines & Photo-Aging', desc: 'Loss of elasticity, firmness, and fine lines' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6">
      {/* Header & Step Indicator */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-mono tracking-widest text-stone-500 uppercase">
          <span>Diagnostic Assessment • Step {step} of 3</span>
          <span>{step === 1 ? '33%' : step === 2 ? '66%' : '100%'} Completed</span>
        </div>
        <div className="h-1 w-full bg-stone-200">
          <div
            className="h-full bg-stone-900 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card variant="default" className="p-8 sm:p-10 space-y-8">
        {step === 1 && (
          <div className="space-y-6">
            <header className="space-y-2">
              <h2 className="font-serif text-3xl font-normal text-stone-900">Select Your Skin Profile</h2>
              <p className="text-sm text-stone-600 font-light">Identify your fundamental skin type to establish barrier compatibility.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skinTypes.map((t) => (
                <div
                  key={t.id}
                  onClick={() => updateAnswers({ skinType: t.id })}
                  className={`p-5 border cursor-pointer transition-all ${
                    answers.skinType === t.id
                      ? 'border-stone-900 bg-stone-100/80 ring-1 ring-stone-900'
                      : 'border-stone-200 bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-lg font-medium text-stone-900">{t.title}</h4>
                    {answers.skinType === t.id && <span className="text-xs font-mono text-emerald-700">✓ Selected</span>}
                  </div>
                  <p className="mt-2 text-xs text-stone-500 font-light leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200">
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">Sensitivity Threshold</label>
              <select
                value={answers.sensitivity}
                onChange={(e) => updateAnswers({ sensitivity: e.target.value })}
                className="w-full border border-stone-300 p-3 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
              >
                <option value="LOW">Low Sensitivity (Tolerates strong actives)</option>
                <option value="MODERATE">Moderate Sensitivity (Occasional sting with acids)</option>
                <option value="HIGH">High Sensitivity (Reactive to most fragrance/acids)</option>
              </select>
            </div>

            <Button variant="primary" size="md" className="w-full py-4 tracking-wide" onClick={nextStep}>
              Continue to Skin Concerns →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <header className="space-y-2">
              <h2 className="font-serif text-3xl font-normal text-stone-900">Target Skin Concerns</h2>
              <p className="text-sm text-stone-600 font-light">Select the primary dermal objective for your custom protocol.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {concerns.map((c) => (
                <div
                  key={c.id}
                  onClick={() => updateAnswers({ primaryConcern: c.id })}
                  className={`p-5 border cursor-pointer transition-all ${
                    answers.primaryConcern === c.id
                      ? 'border-stone-900 bg-stone-100/80 ring-1 ring-stone-900'
                      : 'border-stone-200 bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-lg font-medium text-stone-900">{c.title}</h4>
                    {answers.primaryConcern === c.id && <span className="text-xs font-mono text-emerald-700">✓ Selected</span>}
                  </div>
                  <p className="mt-2 text-xs text-stone-500 font-light leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" size="md" className="w-1/2 py-4" onClick={prevStep}>
                ← Back
              </Button>
              <Button variant="primary" size="md" className="w-1/2 py-4 tracking-wide" onClick={nextStep}>
                Continue to Safety Checks →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <header className="space-y-2">
              <h2 className="font-serif text-3xl font-normal text-stone-900">Safety & Allergen Verification</h2>
              <p className="text-sm text-stone-600 font-light">Enforce strict contraindication rules to prevent active conflicts.</p>
            </header>

            <div className="p-5 border border-stone-200 bg-stone-50/60 flex items-center justify-between">
              <div>
                <label htmlFor="pregnancy" className="font-medium text-sm text-stone-900 block">Pregnancy or Nursing Status</label>
                <p className="text-xs text-stone-500 font-light">Filters out Salicylic Acid & High-Dose Retinoids automatically.</p>
              </div>
              <input
                type="checkbox"
                id="pregnancy"
                checked={answers.isPregnant}
                onChange={(e) => updateAnswers({ isPregnant: e.target.checked })}
                className="h-5 w-5 border-stone-300 text-stone-900 focus:ring-stone-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-600">Known Allergies / Sensitivities</label>
              <input
                type="text"
                value={answers.allergies || ''}
                onChange={(e) => updateAnswers({ allergies: e.target.value })}
                placeholder="e.g. Fragrance, Essential Oils, Nuts, Sulfates"
                className="w-full border border-stone-300 p-3 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" size="md" className="w-1/2 py-4" onClick={prevStep}>
                ← Back
              </Button>
              <Button variant="primary" size="md" className="w-1/2 py-4 tracking-wide" onClick={onComplete}>
                Generate Custom Routine ✨
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
