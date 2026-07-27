import { Test, TestingModule } from '@nestjs/testing';
import { RoutineService } from '../src/routine/routine.service';
import { MorningRoutineBuilder } from '../src/routine/builders/morning-routine.builder';
import { EveningRoutineBuilder } from '../src/routine/builders/evening-routine.builder';
import { CustomerService } from '../src/customer/customer.service';
import { RecommendationService } from '../src/recommendation/recommendation.service';
import { AIExplanationService } from '../src/ai-explanation/ai-explanation.service';
import { KnowledgeService } from '../src/knowledge/services/knowledge.service';
import { KnowledgeCacheService } from '../src/knowledge/cache/knowledge-cache.service';
import { ExplanationCacheService } from '../src/ai-explanation/cache/explanation-cache.service';
import { CandidateProductGenerator } from '../src/recommendation/generator/candidate-product-generator';

describe('RoutineService & Routine Builders Unit Tests', () => {
  let morningBuilder: MorningRoutineBuilder;
  let eveningBuilder: EveningRoutineBuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutineService,
        MorningRoutineBuilder,
        EveningRoutineBuilder,
        CustomerService,
        RecommendationService,
        CandidateProductGenerator,
        AIExplanationService,
        KnowledgeService,
        KnowledgeCacheService,
        ExplanationCacheService,
      ],
    }).compile();

    morningBuilder = module.get<MorningRoutineBuilder>(MorningRoutineBuilder);
    eveningBuilder = module.get<EveningRoutineBuilder>(EveningRoutineBuilder);
  });

  it('MorningRoutineBuilder should include SPF in morning step sequence', () => {
    const mockProducts = [
      {
        productId: 'p1',
        name: 'Daily Sunscreen SPF 50',
        brand: 'Aesop',
        category: 'Sunscreen',
        productType: 'SUNSCREEN',
        price: 45,
        currency: 'USD',
        score: 95,
        matchedRules: [],
        rejectedRules: [],
        warnings: [],
      },
    ];

    const steps = morningBuilder.buildMorningRoutine(mockProducts);
    expect(steps).toBeDefined();
    expect(steps.some((s) => s.stepCategory === 'PROTECT')).toBe(true);
  });

  it('EveningRoutineBuilder should assemble evening repair sequence', () => {
    const mockProducts = [
      {
        productId: 'p2',
        name: 'Night Cream',
        brand: 'Aesop',
        category: 'Moisturizer',
        productType: 'MOISTURIZER',
        price: 55,
        currency: 'USD',
        score: 90,
        matchedRules: [],
        rejectedRules: [],
        warnings: [],
      },
    ];

    const steps = eveningBuilder.buildEveningRoutine(mockProducts);
    expect(steps).toBeDefined();
    expect(steps.some((s) => s.stepCategory === 'NOURISH')).toBe(true);
  });
});
