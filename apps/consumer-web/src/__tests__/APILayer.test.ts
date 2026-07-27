import { CustomerApi } from '../api/customer.api';
import { AssessmentApi } from '../api/assessment.api';
import { RoutineApi } from '../api/routine.api';

describe('Sprint 8.1 API Abstraction Layer Tests', () => {
  it('CustomerApi methods should be defined', () => {
    expect(CustomerApi.getProfile).toBeDefined();
    expect(CustomerApi.updateProfile).toBeDefined();
  });

  it('AssessmentApi methods should be defined', () => {
    expect(AssessmentApi.submitAssessment).toBeDefined();
  });

  it('RoutineApi methods should be defined', () => {
    expect(RoutineApi.generateRoutine).toBeDefined();
    expect(RoutineApi.getRoutineById).toBeDefined();
  });
});
