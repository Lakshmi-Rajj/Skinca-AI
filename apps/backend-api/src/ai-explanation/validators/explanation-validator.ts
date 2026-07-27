import { RecommendationExplanationResponse } from '../dto/explanation-response.dto';

export function validateExplanationResponse(payload: any): RecommendationExplanationResponse {
  if (!payload || typeof payload !== 'object') {
    throw new Error('AI explanation payload must be a non-null object');
  }

  if (!payload.summary || typeof payload.summary !== 'string') {
    throw new Error('AI explanation response missing summary string');
  }

  if (!Array.isArray(payload.products)) {
    throw new Error('AI explanation response products must be an array');
  }

  return payload as RecommendationExplanationResponse;
}
