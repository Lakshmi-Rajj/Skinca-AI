import { useState } from 'react';
import { AssessmentAnswers } from '../types/customer.types';
import { AssessmentApi } from '../api/assessment.api';

export function useAssessment() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    skinType: 'COMBINATION',
    primaryConcern: 'acne',
    secondaryConcern: 'hyperpigmentation',
    sensitivity: 'MODERATE',
    isPregnant: false,
    allergies: 'Fragrance',
  });

  const updateAnswers = (fields: Partial<AssessmentAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const submitAssessment = async (customerId: string) => {
    setLoading(true);
    try {
      const result = await AssessmentApi.submitAssessment(customerId, answers);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    answers,
    loading,
    updateAnswers,
    nextStep,
    prevStep,
    submitAssessment,
  };
}
