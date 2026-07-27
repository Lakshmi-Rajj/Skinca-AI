import { IRule, RecommendationContext, RuleEvaluationResult } from '../interfaces/recommendation-context.interface';

export class SkinTypeRule implements IRule {
  readonly ruleName = 'Skin Type Rule';

  evaluate(product: any, context: RecommendationContext): RuleEvaluationResult {
    const skinType = context.profile.skinType;
    const reward = context.weightsConfig.skinTypeMatchReward;

    return {
      ruleName: this.ruleName,
      passed: true,
      scoreDelta: reward,
      message: `Product matches ${skinType} skin profile`,
    };
  }
}
