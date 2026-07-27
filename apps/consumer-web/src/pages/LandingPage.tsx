import React from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

interface LandingPageProps {
  onStartAssessment: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAssessment }) => {
  return (
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
          <Button variant="primary" size="lg" onClick={onStartAssessment}>Take 2-Min Skin Assessment</Button>
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
  );
};
