export interface ProductExplanationItem {
  productId: string;
  title: string;
  explanation: string;
  warnings: string[];
  usage: string;
  confidence: number;
}

export interface RecommendationExplanationResponse {
  summary: string;
  products: ProductExplanationItem[];
  routineExplanation: string;
  generalAdvice: string;
  disclaimer: string;
  providerUsed: string;
  cached: boolean;
}
