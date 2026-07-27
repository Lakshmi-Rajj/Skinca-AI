import { RecommendationRequestDto } from '../dto/recommendation-request.dto';

export interface RuleEvaluationResult {
  ruleName: string;
  passed: boolean;
  scoreDelta: number;
  message: string;
  warning?: string;
  rejectionReason?: string;
}

export interface RecommendationContext {
  tenantId: string;
  profile: RecommendationRequestDto;
  weightsConfig: {
    baselineScore: number;
    skinTypeMatchReward: number;
    skinConcernMatchReward: number;
    synergisticActiveReward: number;
    pregnancyViolationPenalty: number;
    allergyViolationPenalty: number;
    routineConflictPenalty: number;
    ampmMisallocationPenalty: number;
    uvSensitivityPenalty: number;
    minimumEligibleScoreThreshold: number;
    maxRecommendedProducts: number;
  };
}

export interface IRule {
  readonly ruleName: string;
  evaluate(product: any, context: RecommendationContext): RuleEvaluationResult;
}
