import { IRule, RecommendationContext, RuleEvaluationResult } from '../interfaces/recommendation-context.interface';
import { isPregnancySafe } from '@platform/dermatological-rules';

export class PregnancySafetyRule implements IRule {
  readonly ruleName = 'Pregnancy Safety Rule';

  evaluate(product: any, context: RecommendationContext): RuleEvaluationResult {
    if (!context.profile.isPregnant) {
      return {
        ruleName: this.ruleName,
        passed: true,
        scoreDelta: 0,
        message: 'Pregnancy safety restriction not applicable',
      };
    }

    const isSafe = product.formulation.every((f: any) => isPregnancySafe(f.ingredient.inciName));

    if (!isSafe) {
      return {
        ruleName: this.ruleName,
        passed: false,
        scoreDelta: context.weightsConfig.pregnancyViolationPenalty,
        message: 'Contains active ingredients contraindicated during pregnancy',
        warning: 'Contains pregnancy contraindicated active ingredients.',
        rejectionReason: 'PREGNANCY_SAFETY_VIOLATION',
      };
    }

    return {
      ruleName: this.ruleName,
      passed: true,
      scoreDelta: 0,
      message: 'Product formulation verified pregnancy safe',
    };
  }
}
