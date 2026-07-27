import React from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

interface ResultsPageProps {
  onRestart: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onRestart }) => {
  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end border-b border-stone-200 pb-6">
        <div>
          <Badge variant="success">Engine Match Score: 96%</Badge>
          <h1 className="font-serif text-3xl font-normal text-stone-900 mt-2">Your Personalized Skincare Protocol</h1>
          <p className="text-sm text-stone-500 mt-1">Formulated for Combination skin targeting Acne & Hyperpigmentation.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRestart}>Re-run Assessment</Button>
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
  );
};
