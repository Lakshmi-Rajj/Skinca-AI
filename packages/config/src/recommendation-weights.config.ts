export const RECOMMENDATION_WEIGHTS_CONFIG = {
  baselineScore: 50.0,
  skinTypeMatchReward: 15.0,
  skinConcernMatchReward: 10.0,
  synergisticActiveReward: 10.0,
  pregnancyViolationPenalty: -100.0,
  allergyViolationPenalty: -100.0,
  routineConflictPenalty: -20.0,
  ampmMisallocationPenalty: -20.0,
  uvSensitivityPenalty: -10.0,
  minimumEligibleScoreThreshold: 30.0,
  maxRecommendedProducts: 10,
};
