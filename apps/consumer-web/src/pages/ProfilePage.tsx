import React from 'react';
import { Card, Badge } from '@platform/ui-components';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      <header className="space-y-2 border-b border-stone-200 pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-stone-500">Customer Management</span>
        <h1 className="font-serif text-4xl font-normal text-stone-900">Customer Profile & Assessment History</h1>
      </header>

      <Card variant="bordered" className="p-8 space-y-6">
        <h3 className="font-serif text-2xl font-normal text-stone-900 border-b border-stone-200 pb-3">Active Profile Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-stone-500 text-xs font-mono uppercase block">Skin Type</span>
            <strong className="text-stone-900 font-serif text-lg">COMBINATION</strong>
          </div>
          <div>
            <span className="text-stone-500 text-xs font-mono uppercase block">Primary Concern</span>
            <strong className="text-stone-900 font-serif text-lg">Acne & Blemishes</strong>
          </div>
          <div>
            <span className="text-stone-500 text-xs font-mono uppercase block">Sensitivity Level</span>
            <strong className="text-stone-900 font-serif text-lg">MODERATE</strong>
          </div>
          <div>
            <span className="text-stone-500 text-xs font-mono uppercase block">Pregnancy / Nursing</span>
            <strong className="text-stone-900 font-serif text-lg">No (Not Applicable)</strong>
          </div>
        </div>
      </Card>

      <Card variant="default" className="p-8 space-y-4">
        <h3 className="font-serif text-2xl font-normal text-stone-900 border-b border-stone-200 pb-3">Assessment History</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 border border-stone-200 bg-stone-50/50">
            <div>
              <h4 className="font-serif font-medium text-stone-900">Regimen Protocol v4.1</h4>
              <p className="text-xs text-stone-500 font-mono">Generated: July 28, 2026</p>
            </div>
            <Badge variant="success">Active Protocol</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
