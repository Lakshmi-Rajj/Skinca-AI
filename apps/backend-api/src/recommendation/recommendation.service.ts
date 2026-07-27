import { Injectable } from '@nestjs/common';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import {
  RecommendationResponseDto,
  ProductRecommendationItem,
  RoutineStep,
  RuleEvaluationItem,
} from './dto/recommendation-response.dto';
import { CandidateProductGenerator } from './generator/candidate-product-generator';
import { RECOMMENDATION_WEIGHTS_CONFIG } from '@platform/config';
import { RecommendationContext, IRule } from './interfaces/recommendation-context.interface';
import { SkinTypeRule } from './rules/skin-type.rule';
import { SkinConcernRule } from './rules/skin-concern.rule';
import { PregnancySafetyRule } from './rules/pregnancy-safety.rule';
import { AllergyRule } from './rules/allergy.rule';
import { RoutineConflictRule } from './rules/routine-conflict.rule';

@Injectable()
export class RecommendationService {
  private rules: IRule[] = [
    new SkinTypeRule(),
    new SkinConcernRule(),
    new PregnancySafetyRule(),
    new AllergyRule(),
    new RoutineConflictRule(),
  ];

  constructor(private candidateGenerator: CandidateProductGenerator) {}

  async generateRecommendation(
    tenantId: string,
    dto: RecommendationRequestDto,
  ): Promise<RecommendationResponseDto> {
    const candidates = await this.candidateGenerator.generateCandidates(tenantId, dto);

    const context: RecommendationContext = {
      tenantId,
      profile: dto,
      weightsConfig: RECOMMENDATION_WEIGHTS_CONFIG,
    };

    const evaluatedProducts: ProductRecommendationItem[] = [];
    const avoidedProducts: { productId: string; name: string; reason: string }[] = [];
    const ruleLogs: RuleEvaluationItem[] = [];

    for (const product of candidates) {
      let score = context.weightsConfig.baselineScore;
      const matchedRules: string[] = [];
      const rejectedRules: string[] = [];
      const warnings: string[] = [];

      for (const rule of this.rules) {
        const result = rule.evaluate(product, context);
        score += result.scoreDelta;

        if (result.passed) {
          if (result.scoreDelta > 0) {
            matchedRules.push(result.message);
          }
          ruleLogs.push({
            ruleName: result.ruleName,
            status: result.warning ? 'WARNED' : 'PASSED',
            message: result.message,
            weightDelta: result.scoreDelta,
          });
        } else {
          if (result.rejectionReason) {
            rejectedRules.push(result.rejectionReason);
          }
          ruleLogs.push({
            ruleName: result.ruleName,
            status: 'FAILED',
            message: result.message,
            weightDelta: result.scoreDelta,
          });
        }

        if (result.warning) {
          warnings.push(result.warning);
        }
      }

      const finalScore = Math.max(0, Math.min(100, Math.round(score)));

      if (rejectedRules.length > 0 || finalScore < context.weightsConfig.minimumEligibleScoreThreshold) {
        avoidedProducts.push({
          productId: product.id,
          name: product.name,
          reason: warnings.join(' | ') || 'Low overall skin profile compatibility score.',
        });
      } else {
        evaluatedProducts.push({
          productId: product.id,
          name: product.name,
          brand: product.brandName || 'Brand',
          category: product.category ? product.category.name : 'Skincare',
          productType: product.productType || 'TREATMENT',
          price: product.price ? Number(product.price) : 0,
          currency: product.currency || 'USD',
          score: finalScore,
          matchedRules,
          rejectedRules,
          warnings,
        });
      }
    }

    evaluatedProducts.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    const morningRoutine: RoutineStep[] = [];
    const eveningRoutine: RoutineStep[] = [];

    const cleansers = evaluatedProducts.filter((p) => p.productType.toUpperCase() === 'CLEANSER' || p.category.toLowerCase().includes('cleanse'));
    const treatments = evaluatedProducts.filter((p) => p.productType.toUpperCase() === 'SERUM' || p.category.toLowerCase().includes('serum') || p.category.toLowerCase().includes('treatment'));
    const moisturizers = evaluatedProducts.filter((p) => p.productType.toUpperCase() === 'MOISTURIZER' || p.category.toLowerCase().includes('moistur'));
    const sunscreens = evaluatedProducts.filter((p) => p.productType.toUpperCase() === 'SUNSCREEN' || p.category.toLowerCase().includes('sun'));

    let morningStep = 1;
    if (cleansers[0]) {
      morningRoutine.push({
        stepNumber: morningStep++,
        stepCategory: 'CLEANSE',
        product: cleansers[0],
        usageInstructions: 'Gently cleanse face with warm water morning and evening.',
      });
    }
    if (treatments[0]) {
      morningRoutine.push({
        stepNumber: morningStep++,
        stepCategory: 'TREAT',
        product: treatments[0],
        usageInstructions: 'Apply 2-3 drops to dry skin after cleansing.',
      });
    }
    if (moisturizers[0]) {
      morningRoutine.push({
        stepNumber: morningStep++,
        stepCategory: 'HYDRATE',
        product: moisturizers[0],
        usageInstructions: 'Massage moisturizer evenly over face and neck.',
      });
    }
    if (sunscreens[0]) {
      morningRoutine.push({
        stepNumber: morningStep++,
        stepCategory: 'PROTECT',
        product: sunscreens[0],
        usageInstructions: 'Apply broad-spectrum sunscreen as final AM step.',
      });
    }

    let eveningStep = 1;
    if (cleansers[0]) {
      eveningRoutine.push({
        stepNumber: eveningStep++,
        stepCategory: 'CLEANSE',
        product: cleansers[0],
        usageInstructions: 'Double cleanse to remove daily impurities.',
      });
    }
    if (treatments[1] || treatments[0]) {
      eveningRoutine.push({
        stepNumber: eveningStep++,
        stepCategory: 'REPAIR',
        product: treatments[1] || treatments[0],
        usageInstructions: 'Apply evening active treatment before moisturization.',
      });
    }
    if (moisturizers[0]) {
      eveningRoutine.push({
        stepNumber: eveningStep++,
        stepCategory: 'NOURISH',
        product: moisturizers[0],
        usageInstructions: 'Apply rich night layer to lock in hydration.',
      });
    }

    const passedCount = ruleLogs.filter((r) => r.status === 'PASSED').length;
    const failedCount = ruleLogs.filter((r) => r.status === 'FAILED').length;
    const confidenceScore = Math.round((passedCount / Math.max(1, ruleLogs.length)) * 100);

    return {
      morningRoutine,
      eveningRoutine,
      recommendedProducts: evaluatedProducts.slice(0, context.weightsConfig.maxRecommendedProducts),
      avoidedProducts,
      ruleEvaluationSummary: {
        totalRulesEvaluated: ruleLogs.length,
        passedRulesCount: passedCount,
        failedRulesCount: failedCount,
        ruleLogs,
      },
      confidenceScore,
    };
  }
}
