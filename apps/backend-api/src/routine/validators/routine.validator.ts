import { RoutineStep } from '../../recommendation/dto/recommendation-response.dto';

export function validateRoutineStructure(morningSteps: RoutineStep[], eveningSteps: RoutineStep[]): string[] {
  const warnings: string[] = [];

  const hasMorningCleanser = morningSteps.some((s) => s.stepCategory === 'CLEANSE');
  if (!hasMorningCleanser) {
    warnings.push('Missing recommended morning cleansing step.');
  }

  const hasMorningSunscreen = morningSteps.some((s) => s.stepCategory === 'PROTECT');
  if (!hasMorningSunscreen) {
    warnings.push('Missing morning broad-spectrum sunscreen protection step.');
  }

  const hasMoisturizer = morningSteps.some((s) => s.stepCategory === 'HYDRATE') || eveningSteps.some((s) => s.stepCategory === 'NOURISH');
  if (!hasMoisturizer) {
    warnings.push('Missing hydrating moisturizer step.');
  }

  return warnings;
}
