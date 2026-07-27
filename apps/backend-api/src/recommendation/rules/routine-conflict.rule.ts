import { IRule, RecommendationContext, RuleEvaluationResult } from '../interfaces/recommendation-context.interface';
import { isConflictingActivePair } from '@platform/dermatological-rules';

export class RoutineConflictRule implements IRule {
  readonly ruleName = 'Existing Routine Conflict Rule';

  evaluate(product: any, context: RecommendationContext): RuleEvaluationResult {
    const existingActives = context.profile.existingRoutineActives || [];
    if (existingActives.length === 0) {
      return {
        ruleName: this.ruleName,
        passed: true,
        scoreDelta: 0,
        message: 'No existing routine actives specified',
      };
    }

    for (const active of existingActives) {
      for (const f of product.formulation) {
        if (isConflictingActivePair(active, f.ingredient.inciName)) {
          return {
            ruleName: this.ruleName,
            passed: true,
            scoreDelta: context.weightsConfig.routineConflictPenalty,
            message: `Active conflict between ${active} and ${f.ingredient.displayName}`,
            warning: `Conflict warning: ${active} + ${f.ingredient.displayName}`,
          };
        }
      }
    }

    return {
      ruleName: this.ruleName,
      passed: true,
      scoreDelta: 0,
      message: 'No conflicts detected with existing user routine',
    };
  }
}
