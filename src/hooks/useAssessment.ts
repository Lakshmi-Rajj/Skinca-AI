import { useState } from 'react';

export interface AssessmentAnswers {
  skinType: 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE';
  primaryConcern: 'acne' | 'hyperpigmentation' | 'redness' | 'aging';
  sensitivity: 'LOW' | 'MODERATE' | 'HIGH';
  isPregnant: boolean;
  allergies: string;
}

export function useAssessment() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    skinType: 'COMBINATION',
    primaryConcern: 'acne',
    sensitivity: 'MODERATE',
    isPregnant: false,
    allergies: 'Fragrance',
  });

  const updateAnswers = (fields: Partial<AssessmentAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((value) => Math.min(3, value + 1));
  const prevStep = () => setStep((value) => Math.max(1, value - 1));
  const reset = () => setStep(1);

  return { step, answers, updateAnswers, nextStep, prevStep, reset };
}
