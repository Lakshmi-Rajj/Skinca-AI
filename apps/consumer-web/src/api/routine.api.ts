import { fetchApi } from './api-client';
import { PersonalizedRoutine } from '../types/routine.types';

export const RoutineApi = {
  generateRoutine: (customerId: string, routineType = 'STANDARD') =>
    fetchApi<PersonalizedRoutine>('/routines/generate', {
      method: 'POST',
      body: JSON.stringify({ customerId, routineType }),
    }),
  getRoutineById: (routineId: string) => fetchApi<PersonalizedRoutine>(`/routines/${routineId}`),
};
