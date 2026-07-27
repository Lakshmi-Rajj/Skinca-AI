import { Injectable } from '@nestjs/common';
import { RoutineStep, ProductRecommendationItem } from '../../recommendation/dto/recommendation-response.dto';

@Injectable()
export class EveningRoutineBuilder {
  buildEveningRoutine(
    recommendedProducts: ProductRecommendationItem[],
    routineType = 'STANDARD',
  ): RoutineStep[] {
    const steps: RoutineStep[] = [];
    let stepCount = 1;

    const cleansers = recommendedProducts.filter((p) => p.productType.toUpperCase() === 'CLEANSER' || p.category.toLowerCase().includes('cleanse'));
    const treatments = recommendedProducts.filter((p) => p.productType.toUpperCase() === 'SERUM' || p.category.toLowerCase().includes('serum') || p.category.toLowerCase().includes('treatment'));
    const moisturizers = recommendedProducts.filter((p) => p.productType.toUpperCase() === 'MOISTURIZER' || p.category.toLowerCase().includes('moistur'));

    // Step 1: Double Cleanse
    if (cleansers[0]) {
      steps.push({
        stepNumber: stepCount++,
        stepCategory: 'CLEANSE',
        product: cleansers[0],
        usageInstructions: 'Double cleanse to remove sunscreen and daily impurities.',
      });
    }

    // Step 2: Repair & Treat
    if (treatments[1] || treatments[0]) {
      steps.push({
        stepNumber: stepCount++,
        stepCategory: 'REPAIR',
        product: treatments[1] || treatments[0],
        usageInstructions: 'Apply evening active repairing formulation.',
      });
    }

    // Step 3: Nourish
    if (moisturizers[0]) {
      steps.push({
        stepNumber: stepCount++,
        stepCategory: 'NOURISH',
        product: moisturizers[0],
        usageInstructions: 'Apply rich night layer to lock in hydration.',
      });
    }

    return steps;
  }
}
