import { IRule, RecommendationContext, RuleEvaluationResult } from '../interfaces/recommendation-context.interface';

export class SkinConcernRule implements IRule {
  readonly ruleName = 'Skin Concern Rule';

  evaluate(product: any, context: RecommendationContext): RuleEvaluationResult {
    const concerns = context.profile.skinConcerns || [];
    if (concerns.length === 0) {
      return {
        ruleName: this.ruleName,
        passed: true,
        scoreDelta: 0,
        message: 'No specific target skin concerns declared',
      };
    }

    let matches = 0;
    for (const concern of concerns) {
      if (
        product.name.toLowerCase().includes(concern.toLowerCase()) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(concern.toLowerCase()))
      ) {
        matches++;
      }
    }

    const delta = matches * context.weightsConfig.skinConcernMatchReward;

    return {
      ruleName: this.ruleName,
      passed: matches > 0,
      scoreDelta: delta,
      message: matches > 0 ? `Matches ${matches} target skin concerns` : 'No direct target skin concern match',
    };
  }
}
