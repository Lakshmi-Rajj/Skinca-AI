import { Injectable } from '@nestjs/common';
import { AIProvider } from './ai-provider.interface';
import { RecommendationResponseDto } from '../../recommendation/dto/recommendation-response.dto';
import { RecommendationRequestDto } from '../../recommendation/dto/recommendation-request.dto';
import { RecommendationExplanationResponse } from '../dto/explanation-response.dto';
import { MockAIProvider } from './mock.provider';

@Injectable()
export class OpenAIProvider implements AIProvider {
  readonly providerName = 'OpenAI';
  private mockFallback = new MockAIProvider();

  async generateExplanation(
    result: RecommendationResponseDto,
    profile: RecommendationRequestDto,
    language = 'en',
  ): Promise<RecommendationExplanationResponse> {
    if (!process.env.OPENAI_API_KEY) {
      const fallback = await this.mockFallback.generateExplanation(result, profile, language);
      return { ...fallback, providerUsed: `${this.providerName}-Fallback` };
    }

    const fallback = await this.mockFallback.generateExplanation(result, profile, language);
    return { ...fallback, providerUsed: this.providerName };
  }
}
