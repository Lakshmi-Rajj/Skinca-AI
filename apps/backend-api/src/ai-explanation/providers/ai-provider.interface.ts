import { RecommendationResponseDto } from '../../recommendation/dto/recommendation-response.dto';
import { RecommendationRequestDto } from '../../recommendation/dto/recommendation-request.dto';
import { RecommendationExplanationResponse } from '../dto/explanation-response.dto';

export interface AIProvider {
  readonly providerName: string;
  generateExplanation(
    result: RecommendationResponseDto,
    profile: RecommendationRequestDto,
    language?: string,
  ): Promise<RecommendationExplanationResponse>;
}
