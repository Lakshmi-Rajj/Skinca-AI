import { Injectable } from '@nestjs/common';
import { AIProvider } from './ai-provider.interface';
import { RecommendationResponseDto } from '../../recommendation/dto/recommendation-response.dto';
import { RecommendationRequestDto } from '../../recommendation/dto/recommendation-request.dto';
import { RecommendationExplanationResponse } from '../dto/explanation-response.dto';

@Injectable()
export class MockAIProvider implements AIProvider {
  readonly providerName = 'Mock';

  async generateExplanation(
    result: RecommendationResponseDto,
    profile: RecommendationRequestDto,
    language = 'en',
  ): Promise<RecommendationExplanationResponse> {
    const productExplanations = result.recommendedProducts.map((p) => ({
      productId: p.productId,
      title: `${p.name} by ${p.brand}`,
      explanation: `Formulated specifically for ${profile.skinType.toLowerCase()} skin profiles. Address targets including ${(profile.skinConcerns || []).join(', ')}.`,
      warnings: p.warnings,
      usage: `Apply during daily routine step as directed.`,
      confidence: p.score,
    }));

    return {
      summary: `Your custom routine is tailored for your ${profile.skinType} skin and targets ${(profile.skinConcerns || ['overall skin health']).join(' and ')}.`,
      products: productExplanations,
      routineExplanation: `Follow your Morning routine to protect and hydrate, and your Evening routine to repair skin barrier integrity.`,
      generalAdvice: `Always perform a patch test before introducing new skincare products and apply broad-spectrum SPF daily.`,
      disclaimer: `This routine is for cosmetic skin maintenance and does not substitute professional medical or dermatological advice.`,
      providerUsed: this.providerName,
      cached: false,
    };
  }
}
