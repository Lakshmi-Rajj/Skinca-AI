import { Injectable } from '@nestjs/common';
import { RoutineStep, ProductRecommendationItem } from '../../recommendation/dto/recommendation-response.dto';

@Injectable()
export class MorningRoutineBuilder {
  buildMorningRoutine(
    recommendedProducts: ProductRecommendationItem[],
    routineType = 'STANDARD',
  ): RoutineStep[] {
    const steps: RoutineStep[] = [];
    let stepCount = 1;

    const cleansers = recommendedProducts.filter((p) => p.productType.toUpperCase() === 'CLEANSER' || p.category.toLowerCase().includes('cleanse'));
    const treatments = recommendedProducts.filter((p) => p.productType.toUpperCase() === 'SERUM' || p.category.toLowerCase().includes('serum') || p.category.toLowerCase().includes('treatment'));
    const moisturizers = recommendedProducts.filter((p) => p.productType.toUpperCase() === 'MOISTURIZER' || p.category.toLowerCase().includes('moistur'));
    const sunscreens = recommendedProducts.filter((p) => p.productType.toUpperCase() === 'SUNSCREEN' || p.category.toLowerCase().includes('sun'));

    // Step 1: Cleanse
    if (cleansers[0]) {
      steps.push({
        stepNumber: stepCount++,
        stepCategory: 'CLEANSE',
        product: cleansers[0],
        usageInstructions: 'Gently cleanse skin with tepid water morning.',
      });
    }

    // Step 2: Treat (skip if MINIMAL)
    if (routineType !== 'MINIMAL' && treatments[0]) {
      steps.push({
        stepNumber: stepCount++,
        stepCategory: 'TREAT',
        product: treatments[0],
        usageInstructions: 'Apply 2-3 drops of active treatment serum.',
      });
    }

    // Step 3: Hydrate
    if (moisturizers[0]) {
      steps.push({
        stepNumber: stepCount++,
        stepCategory: 'HYDRATE',
        product: moisturizers[0],
        usageInstructions: 'Smooth moisturizer over face and neck.',
      });
    }

    // Step 4: Protect (Mandatory AM)
    if (sunscreens[0]) {
      steps.push({
        stepNumber: stepCount++,
        stepCategory: 'PROTECT',
        product: sunscreens[0],
        usageInstructions: 'Apply generous layer of broad-spectrum SPF 30+.',
      });
    }

    return steps;
  }
}
