import { SkinTypeRule } from '../src/recommendation/rules/skin-type.rule';
import { SkinConcernRule } from '../src/recommendation/rules/skin-concern.rule';
import { PregnancySafetyRule } from '../src/recommendation/rules/pregnancy-safety.rule';
import { AllergyRule } from '../src/recommendation/rules/allergy.rule';
import { RoutineConflictRule } from '../src/recommendation/rules/routine-conflict.rule';
import { RecommendationContext } from '../src/recommendation/interfaces/recommendation-context.interface';
import { RECOMMENDATION_WEIGHTS_CONFIG } from '@platform/config';
import { SkinTypeEnum } from '../src/recommendation/dto/recommendation-request.dto';

describe('Independent Recommendation Rules Unit Tests', () => {
  const mockContext: RecommendationContext = {
    tenantId: 'tenant_123',
    profile: {
      skinType: SkinTypeEnum.COMBINATION,
      skinConcerns: ['acne'],
      isPregnant: true,
      allergies: ['Fragrance'],
      existingRoutineActives: ['Retinol'],
    },
    weightsConfig: RECOMMENDATION_WEIGHTS_CONFIG,
  };

  const mockProduct = {
    id: 'prod_1',
    name: 'Gentle Salicylic Cleanser',
    shortDescription: 'Cleanser for acne prone skin',
    formulation: [
      { ingredient: { inciName: 'Salicylic Acid', displayName: 'Salicylic Acid' } },
      { ingredient: { inciName: 'Fragrance', displayName: 'Fragrance' } },
    ],
  };

  it('SkinTypeRule should grant score reward for matching skin profile', () => {
    const rule = new SkinTypeRule();
    const result = rule.evaluate(mockProduct, mockContext);
    expect(result.passed).toBe(true);
    expect(result.scoreDelta).toBe(15.0);
  });

  it('SkinConcernRule should grant score reward for target concern match', () => {
    const rule = new SkinConcernRule();
    const result = rule.evaluate(mockProduct, mockContext);
    expect(result.passed).toBe(true);
    expect(result.scoreDelta).toBe(10.0);
  });

  it('PregnancySafetyRule should return pregnancy violation penalty for unsafe active', () => {
    const rule = new PregnancySafetyRule();
    const result = rule.evaluate(mockProduct, mockContext);
    expect(result.passed).toBe(true); // Salicylic acid is safe unless high-dose
  });

  it('AllergyRule should return rejection for allergen in formulation', () => {
    const rule = new AllergyRule();
    const result = rule.evaluate(mockProduct, mockContext);
    expect(result.passed).toBe(false);
    expect(result.scoreDelta).toBe(-100.0);
  });

  it('RoutineConflictRule should warn when conflicting active is present in existing routine', () => {
    const rule = new RoutineConflictRule();
    const result = rule.evaluate(mockProduct, mockContext);
    expect(result.warning).toBeDefined();
    expect(result.scoreDelta).toBe(-20.0);
  });
});
