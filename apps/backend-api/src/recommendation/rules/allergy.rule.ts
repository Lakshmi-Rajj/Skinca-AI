import { IRule, RecommendationContext, RuleEvaluationResult } from '../interfaces/recommendation-context.interface';

export class AllergyRule implements IRule {
  readonly ruleName = 'Allergy Rule';

  evaluate(product: any, context: RecommendationContext): RuleEvaluationResult {
    const allergies = context.profile.allergies || [];
    if (allergies.length === 0) {
      return {
        ruleName: this.ruleName,
        passed: true,
        scoreDelta: 0,
        message: 'No user allergies declared',
      };
    }

    for (const allergy of allergies) {
      const found = product.formulation.some(
        (f: any) =>
          f.ingredient.inciName.toLowerCase().includes(allergy.toLowerCase()) ||
          f.ingredient.displayName.toLowerCase().includes(allergy.toLowerCase()),
      );
      if (found) {
        return {
          ruleName: this.ruleName,
          passed: false,
          scoreDelta: context.weightsConfig.allergyViolationPenalty,
          message: `Contains declared allergen ${allergy}`,
          warning: `Contains declared allergen ${allergy}.`,
          rejectionReason: `ALLERGY_VIOLATION:${allergy}`,
        };
      }
    }

    return {
      ruleName: this.ruleName,
      passed: true,
      scoreDelta: 0,
      message: 'No declared allergens present in formulation',
    };
  }
}
