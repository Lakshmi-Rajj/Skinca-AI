import { useState, useCallback } from 'react';
import { PersonalizedRoutine } from '../types/routine.types';
import { RoutineApi } from '../api/routine.api';

export function useRoutine() {
  const [routine, setRoutine] = useState<PersonalizedRoutine | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutine = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await RoutineApi.generateRoutine(customerId);
      setRoutine(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate personalized routine');
    } finally {
      setLoading(false);
    }
  }, []);

  return { routine, loading, error, fetchRoutine };
}
