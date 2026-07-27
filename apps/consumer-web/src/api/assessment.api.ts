import { fetchApi } from './api-client';
import { AssessmentAnswers } from '../types/customer.types';

export const AssessmentApi = {
  submitAssessment: (customerId: string, answers: AssessmentAnswers) =>
    fetchApi<{ assessmentId: string; calculatedProfile: any }>('/assessment', {
      method: 'POST',
      body: JSON.stringify({ customerId, questionnaireAnswers: answers }),
    }),
};
