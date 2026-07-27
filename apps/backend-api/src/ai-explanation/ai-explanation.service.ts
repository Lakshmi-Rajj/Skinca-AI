import { Injectable } from '@nestjs/common';
import { ExplanationRequestDto } from './dto/explanation-request.dto';
import { RecommendationExplanationResponse } from './dto/explanation-response.dto';
import { ExplanationCacheService } from './cache/explanation-cache.service';
import { validateExplanationResponse } from './validators/explanation-validator';
import { AIProvider } from './providers/ai-provider.interface';
import { MockAIProvider } from './providers/mock.provider';
import { OpenAIProvider } from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { GeminiProvider } from './providers/gemini.provider';

@Injectable()
export class AIExplanationService {
  private providers: Record<string, AIProvider> = {
    mock: new MockAIProvider(),
    openai: new OpenAIProvider(),
    anthropic: new AnthropicProvider(),
    gemini: new GeminiProvider(),
  };

  constructor(private cacheService: ExplanationCacheService) {}

  async generateExplanation(
    tenantId: string,
    dto: ExplanationRequestDto,
  ): Promise<RecommendationExplanationResponse> {
    const cacheKey = `explanation:${tenantId}:${dto.customerProfile.skinType}:${dto.language || 'en'}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const providerKey = (process.env.AI_PROVIDER || 'mock').toLowerCase();
    const provider = this.providers[providerKey] || this.providers.mock;

    const rawResponse = await provider.generateExplanation(
      dto.recommendationResult,
      dto.customerProfile,
      dto.language,
    );

    const validated = validateExplanationResponse(rawResponse);

    await this.cacheService.set(cacheKey, validated);
    return validated;
  }
}
