import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductRepository,
  IngredientRepository,
  CategoryRepository,
  ClaimRepository,
} from '@platform/database-client';
import {
  isConflictingActivePair,
  isSynergisticPair,
  isPregnancySafe,
  PHOTOSENSITIVE_INGREDIENTS,
  RECOMMENDED_TIME_OF_DAY,
} from '@platform/dermatological-rules';
import { KnowledgeCacheService } from '../cache/knowledge-cache.service';

@Injectable()
export class KnowledgeService {
  private productRepository = new ProductRepository();
  private ingredientRepository = new IngredientRepository();
  private categoryRepository = new CategoryRepository();
  private claimRepository = new ClaimRepository();

  constructor(private cacheService: KnowledgeCacheService) {}

  async getProductKnowledge(tenantId: string, productId: string): Promise<any> {
    const cacheKey = `knowledge:product:${tenantId}:${productId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const product = await this.productRepository.findById(tenantId, productId);
    if (!product) {
      throw new NotFoundException('Product knowledge record not found');
    }

    const formulationSummary = product.formulation.map((f) => ({
      inciName: f.ingredient.inciName,
      displayName: f.ingredient.displayName,
      declaredConcentration: f.declaredConcentration,
      isPrimaryActive: f.isPrimaryActive,
      isHighlighted: f.isHighlighted,
      safetyRating: f.ingredient.safetyRating || f.ingredient.irritationRisk,
      pregnancySafe: isPregnancySafe(f.ingredient.inciName),
      photosensitive: PHOTOSENSITIVE_INGREDIENTS.includes(f.ingredient.inciName),
      recommendedTimeOfDay: RECOMMENDED_TIME_OF_DAY[f.ingredient.inciName] || 'BOTH',
    }));

    const knowledgePayload = {
      product: {
        id: product.id,
        name: product.name,
        brand: product.brandName,
        category: product.category.name,
        price: product.price,
        currency: product.currency,
        status: product.status,
      },
      formulation: formulationSummary,
      activeIngredients: formulationSummary.filter((f) => f.isPrimaryActive),
      highlightedIngredients: formulationSummary.filter((f) => f.isHighlighted),
      claims: product.claims.map((c) => c.name),
      isPregnancySafe: formulationSummary.every((f) => f.pregnancySafe),
      isFragranceFree: !formulationSummary.some((f) => f.inciName.toLowerCase().includes('parfum') || f.inciName.toLowerCase().includes('fragrance')),
    };

    await this.cacheService.set(cacheKey, knowledgePayload, 600);
    return knowledgePayload;
  }

  async getIngredientKnowledge(ingredientId: string): Promise<any> {
    const cacheKey = `knowledge:ingredient:${ingredientId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const ingredient = await this.ingredientRepository.findById(ingredientId);
    if (!ingredient) {
      throw new NotFoundException('Ingredient knowledge record not found');
    }

    const knowledgePayload = {
      id: ingredient.id,
      inciName: ingredient.inciName,
      displayName: ingredient.displayName,
      description: ingredient.description,
      category: ingredient.category,
      functions: ingredient.functions,
      irritationRisk: ingredient.irritationRisk,
      safetyRating: ingredient.safetyRating,
      pregnancySafe: isPregnancySafe(ingredient.inciName),
      photosensitive: ingredient.photosensitivity || PHOTOSENSITIVE_INGREDIENTS.includes(ingredient.inciName),
      comedogenicRating: ingredient.comedogenicRating,
      recommendedTimeOfDay: RECOMMENDED_TIME_OF_DAY[ingredient.inciName] || 'BOTH',
    };

    await this.cacheService.set(cacheKey, knowledgePayload, 600);
    return knowledgePayload;
  }

  async checkCompatibility(inciName1: string, inciName2: string): Promise<any> {
    const isConflict = isConflictingActivePair(inciName1, inciName2);
    const isSynergistic = isSynergisticPair(inciName1, inciName2);

    return {
      inciName1,
      inciName2,
      compatible: !isConflict,
      isConflict,
      isSynergistic,
      reason: isConflict
        ? `Active combination ${inciName1} + ${inciName2} carries high irritation or neutralization risk.`
        : isSynergistic
        ? `Synergistic combination ${inciName1} + ${inciName2} enhances skin barrier recovery.`
        : 'No known adverse dermatological conflict.',
    };
  }

  async getProductsByIngredient(tenantId: string, ingredientId: string): Promise<any> {
    const { items } = await this.productRepository.findAll(tenantId, { ingredientId, limit: 100 });
    return items;
  }

  async getProductsByClaim(tenantId: string, claimId: string): Promise<any> {
    const { items } = await this.productRepository.findAll(tenantId, { claimId, limit: 100 });
    return items;
  }

  async getProductsByCategory(tenantId: string, categoryId: string): Promise<any> {
    const { items } = await this.productRepository.findAll(tenantId, { categoryId, limit: 100 });
    return items;
  }

  async getPregnancySafeProducts(tenantId: string): Promise<any> {
    const { items } = await this.productRepository.findAll(tenantId, { limit: 100 });
    return items.filter((product) =>
      product.formulation.every((f) => isPregnancySafe(f.ingredient.inciName)),
    );
  }

  async getFragranceFreeProducts(tenantId: string): Promise<any> {
    const { items } = await this.productRepository.findAll(tenantId, { limit: 100 });
    return items.filter(
      (product) =>
        !product.formulation.some(
          (f) =>
            f.ingredient.inciName.toLowerCase().includes('parfum') ||
            f.ingredient.inciName.toLowerCase().includes('fragrance'),
        ),
    );
  }
}
