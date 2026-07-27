import React from 'react';
import { Card } from '@platform/ui-components';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-serif text-3xl font-normal text-stone-900">Customer Profile & Assessment History</h1>
      <Card variant="bordered" className="p-6">
        <h3 className="font-serif text-lg font-medium text-stone-900 mb-4">Active Profile Parameters</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-stone-500">Skin Type:</span> <strong className="text-stone-900">COMBINATION</strong></div>
          <div><span className="text-stone-500">Primary Concern:</span> <strong className="text-stone-900">Acne</strong></div>
          <div><span className="text-stone-500">Sensitivity Level:</span> <strong className="text-stone-900">MODERATE</strong></div>
          <div><span className="text-stone-500">Pregnancy Status:</span> <strong className="text-stone-900">No</strong></div>
        </div>
      </Card>
    </div>
  );
};
