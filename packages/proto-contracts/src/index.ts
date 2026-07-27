export const PROTO_SERVICE_NAME = 'RecommendationService';
export const PROTO_PACKAGE_NAME = 'platform.engine';

export interface ProtoRecommendationRequest {
  tenantId: string;
  userId?: string;
  skinType: string;
  skinConcerns: string[];
  sensitivityLevel: string;
  allergies: string[];
  preferredProductTypes: string[];
  excludedIngredients: string[];
  maxBudget?: number;
}
