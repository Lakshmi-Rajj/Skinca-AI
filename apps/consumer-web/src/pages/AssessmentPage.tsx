import React from 'react';
import { Button, Card } from '@platform/ui-components';
import { useAssessment } from '../hooks/useAssessment';

interface AssessmentPageProps {
  onComplete: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ onComplete }) => {
  const { step, answers, updateAnswers, nextStep, prevStep } = useAssessment();

  return (
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
                value={answers.skinType}
                onChange={(e) => updateAnswers({ skinType: e.target.value })}
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
                value={answers.sensitivity}
                onChange={(e) => updateAnswers({ sensitivity: e.target.value })}
                className="w-full rounded-md border border-stone-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="LOW">Low Sensitivity</option>
                <option value="MODERATE">Moderate Sensitivity</option>
                <option value="HIGH">High Sensitivity / Rosacea Prone</option>
              </select>
            </div>
            <Button variant="primary" size="md" className="w-full" onClick={nextStep}>Continue to Concerns →</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-normal text-stone-900">Step 2: Target Skin Concerns</h2>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Primary Skin Concern</label>
              <select
                value={answers.primaryConcern}
                onChange={(e) => updateAnswers({ primaryConcern: e.target.value })}
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
              <Button variant="outline" size="md" className="w-1/2" onClick={prevStep}>← Back</Button>
              <Button variant="primary" size="md" className="w-1/2" onClick={nextStep}>Continue to Safety →</Button>
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
                checked={answers.isPregnant}
                onChange={(e) => updateAnswers({ isPregnant: e.target.checked })}
                className="h-4 w-4 rounded border-stone-300"
              />
              <label htmlFor="pregnancy" className="text-sm text-stone-700">I am currently pregnant or nursing</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Known Allergies / Sensitivities</label>
              <input
                type="text"
                value={answers.allergies || ''}
                onChange={(e) => updateAnswers({ allergies: e.target.value })}
                placeholder="e.g. Fragrance, Nuts, Sulfates"
                className="w-full rounded-md border border-stone-300 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="md" className="w-1/2" onClick={prevStep}>← Back</Button>
              <Button variant="primary" size="md" className="w-1/2" onClick={onComplete}>Generate Custom Routine ✨</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
