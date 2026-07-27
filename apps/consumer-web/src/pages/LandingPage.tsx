import React from 'react';
import { Button, Card, Badge } from '@platform/ui-components';

interface LandingPageProps {
  onStartAssessment: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAssessment }) => {
  return (
    <div className="space-y-24 py-6">
      {/* Editorial Luxury Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-stone-300 bg-stone-100/90 text-stone-800 text-xs tracking-widest uppercase font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
          Clinical Regimen Builder • v4.1 Engine
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-stone-900 leading-[1.1] tracking-tight">
          Targeted Skincare Formulations with Precision Integrity.
        </h1>

        <p className="text-lg sm:text-xl text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
          Discover a custom morning and evening skincare protocol backed by 10-stage deterministic ingredient analysis and clinical dermatological rules.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            className="px-10 py-5 text-base font-normal tracking-wide bg-stone-900 text-stone-50 hover:bg-stone-800 transition-all shadow-xl"
            onClick={onStartAssessment}
          >
            Start 2-Min Regimen Builder →
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-10 py-5 text-base font-normal tracking-wide border-stone-300 text-stone-800 hover:bg-stone-100"
          >
            Explore INCI Catalog
          </Button>
        </div>
      </section>

      {/* Philosophy Quote Section */}
      <section className="border-y border-stone-200 py-16 text-center max-w-3xl mx-auto">
        <blockquote className="font-serif text-2xl sm:text-3xl text-stone-800 font-normal italic leading-snug">
          "We believe in clinical formulation integrity—combining high-performance actives without toxic filler, misattributed claims, or active ingredient conflicts."
        </blockquote>
        <cite className="block mt-4 text-xs font-mono uppercase tracking-widest text-stone-500 font-medium font-normal">
          — Clinical Dermatology Advisory Board
        </cite>
      </section>

      {/* 3 Pillars of Precision Dermatology */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-200 pt-16">
        <Card variant="bordered" className="p-8 space-y-4">
          <span className="font-serif text-4xl font-light text-stone-400">01</span>
          <h3 className="font-serif text-2xl font-normal text-stone-900">Deterministic Pipeline</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            Zero AI hallucination or score mutation. Every product passes strict skin barrier tolerance, contraindication, and pregnancy safety checks.
          </p>
        </Card>

        <Card variant="bordered" className="p-8 space-y-4">
          <span className="font-serif text-4xl font-light text-stone-400">02</span>
          <h3 className="font-serif text-2xl font-normal text-stone-900">Scientific INCI Mapping</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            We evaluate active ingredient percentages, pH synergy, molecular weights, and photosensitivity to prevent active ingredient conflicts.
          </p>
        </Card>

        <Card variant="bordered" className="p-8 space-y-4">
          <span className="font-serif text-4xl font-light text-stone-400">03</span>
          <h3 className="font-serif text-2xl font-normal text-stone-900">AI Clinical Rationale</h3>
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            Receive clear, human-friendly scientific explanations detailing why each product was selected for your AM/PM routine.
          </p>
        </Card>
      </section>

      {/* Call to Action Bar */}
      <section className="bg-stone-900 text-stone-50 p-12 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-normal">Ready for Your Custom Protocol?</h2>
        <p className="text-stone-300 font-light max-w-xl mx-auto text-sm">
          Complete our 2-minute diagnostic questionnaire and receive a personalized morning and evening skincare regimen.
        </p>
        <div>
          <Button
            variant="outline"
            size="lg"
            className="border-stone-50 text-stone-50 hover:bg-stone-50 hover:text-stone-900 px-8 py-4 text-sm font-medium tracking-wide"
            onClick={onStartAssessment}
          >
            Begin Diagnostic Assessment →
          </Button>
        </div>
      </section>
    </div>
  );
};
