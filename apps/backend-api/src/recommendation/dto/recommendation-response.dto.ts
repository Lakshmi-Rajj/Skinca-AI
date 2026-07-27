export interface RuleEvaluationItem {
  ruleName: string;
  status: 'PASSED' | 'FAILED' | 'WARNED';
  message: string;
  weightDelta: number;
}

export interface ProductRecommendationItem {
  productId: string;
  name: string;
  brand: string;
  category: string;
  productType: string;
  price: number;
  currency: string;
  score: number;
  matchedRules: string[];
  rejectedRules: string[];
  warnings: string[];
}

export interface RoutineStep {
  stepNumber: number;
  stepCategory: string;
  product: ProductRecommendationItem;
  usageInstructions: string;
}

export interface RecommendationResponseDto {
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  recommendedProducts: ProductRecommendationItem[];
  avoidedProducts: { productId: string; name: string; reason: string }[];
  ruleEvaluationSummary: {
    totalRulesEvaluated: number;
    passedRulesCount: number;
    failedRulesCount: number;
    ruleLogs: RuleEvaluationItem[];
  };
  confidenceScore: number;
}
