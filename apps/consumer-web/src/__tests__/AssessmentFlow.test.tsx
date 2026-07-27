import React from 'react';
import { LandingPage } from '../pages/LandingPage';
import { AssessmentPage } from '../pages/AssessmentPage';
import { ResultsPage } from '../pages/ResultsPage';

describe('Sprint 8.1 Consumer Web Page Components Tests', () => {
  it('LandingPage component should be defined', () => {
    expect(LandingPage).toBeDefined();
  });

  it('AssessmentPage wizard component should be defined', () => {
    expect(AssessmentPage).toBeDefined();
  });

  it('ResultsPage protocol component should be defined', () => {
    expect(ResultsPage).toBeDefined();
  });
});
