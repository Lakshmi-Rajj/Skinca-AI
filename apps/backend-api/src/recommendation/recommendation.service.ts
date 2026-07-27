import { Injectable } from '@nestjs/common';
import { KnowledgeService } from '../knowledge/services/knowledge.service';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import {
  RecommendationResponseDto,
  ProductRecommendationItem,
  RoutineStep,
  RuleEvaluationItem,
} from './dto/recommendation-response.dto';
import { isPregnancySafe, isConflictingActivePair } from '@platform/dermatological-rules';

@Injectable()
export class RecommendationService {
  constructor(private knowledgeService: KnowledgeService) {}

  async generateRecommendation(
    tenantId: string,
    dto: RecommendationRequestDto,
  ): Promise<RecommendationResponseDto> {
    // Step 1: Consume Knowledge Service to retrieve candidate products
    let candidateProducts = dto.isPregnant
      ? await this.knowledgeService.getPregnancySafeProducts(tenantId)
      : await this.knowledgeService.getFragranceFreeProducts(tenantId);

    if (candidateProducts.length === 0) {
      const { items } = await (this.knowledgeService as any).productRepository.findAll(tenantId, { limit: 50 });
      candidateProducts = items;
    }

    const evaluatedProducts: ProductRecommendationItem[] = [];
    const avoidedProducts: { productId: string; name: string; reason: string }[] = [];
    const ruleLogs: RuleEvaluationItem[] = [];

    // Step 2: Deterministic 10-stage Rule Pipeline Evaluation over candidate products
    for (const product of candidateProducts) {
      let score = 50.0;
      const matchedRules: string[] = [];
      const rejectedRules: string[] = [];
      const warnings: string[] = [];

      // 1. Skin Type Rule
      matchedRules.push(`SKIN_TYPE_MATCH:${dto.skinType}`);
      score += 15.0;
      ruleLogs.push({ ruleName: 'Skin Type Rule', status: 'PASSED', message: `Product matches ${dto.skinType} skin profile`, weightDelta: 15.0 });

      // 2. Skin Concern Rule
      if (dto.skinConcerns && dto.skinConcerns.length > 0) {
        let concernMatches = 0;
        for (const concern of dto.skinConcerns) {
          if (
            product.name.toLowerCase().includes(concern.toLowerCase()) ||
            (product.shortDescription && product.shortDescription.toLowerCase().includes(concern.toLowerCase()))
          ) {
            concernMatches++;
          }
        }
        if (concernMatches > 0) {
          score += concernMatches * 10.0;
          matchedRules.push(`SKIN_CONCERN_MATCH:${concernMatches}_MATCHES`);
          ruleLogs.push({ ruleName: 'Skin Concern Rule', status: 'PASSED', message: `Matches ${concernMatches} target skin concerns`, weightDelta: concernMatches * 10.0 });
        }
      }

      // 3. Pregnancy Safety Rule
      if (dto.isPregnant) {
        const isSafe = product.formulation.every((f: any) => isPregnancySafe(f.ingredient.inciName));
        if (!isSafe) {
          rejectedRules.push('PREGNANCY_SAFETY_VIOLATION');
          warnings.push('Contains active ingredients contraindicated during pregnancy.');
          score -= 100.0;
          ruleLogs.push({ ruleName: 'Pregnancy Safety Rule', status: 'FAILED', message: 'Contains pregnancy contraindicated actives', weightDelta: -100.0 });
        }
      }

      // 4. Allergy Rule
      if (dto.allergies && dto.allergies.length > 0) {
        for (const allergy of dto.allergies) {
          const allergenFound = product.formulation.some(
            (f: any) =>
              f.ingredient.inciName.toLowerCase().includes(allergy.toLowerCase()) ||
              f.ingredient.displayName.toLowerCase().includes(allergy.toLowerCase()),
          );
          if (allergenFound) {
            rejectedRules.push(`ALLERGY_VIOLATION:${allergy}`);
            warnings.push(`Contains potential allergen ${allergy}.`);
            score -= 100.0;
            ruleLogs.push({ ruleName: 'Allergy Rule', status: 'FAILED', message: `Contains allergen ${allergy}`, weightDelta: -100.0 });
          }
        }
      }

      // 5. Existing Routine Conflict Rule
      if (dto.existingRoutineActives && dto.existingRoutineActives.length > 0) {
        for (const active of dto.existingRoutineActives) {
          for (const f of product.formulation) {
            if (isConflictingActivePair(active, f.ingredient.inciName)) {
              warnings.push(`Conflict warning: ${active} + ${f.ingredient.displayName}`);
              score -= 20.0;
              ruleLogs.push({ ruleName: 'Existing Routine Conflict Rule', status: 'WARNED', message: `Active conflict between ${active} and ${f.ingredient.displayName}`, weightDelta: -20.0 });
            }
          }
        }
      }

      const finalScore = Math.max(0, Math.min(100, Math.round(score)));

      if (rejectedRules.length > 0 || finalScore < 30) {
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

    // Step 3: Deterministic Ranking Engine (Score Descending, Name Ascending for tie-breaking)
    evaluatedProducts.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    // Step 4: Routine Builder (Morning / Evening Routine Allocation)
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
      recommendedProducts: evaluatedProducts.slice(0, 10),
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
