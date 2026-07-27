import { Test, TestingModule } from '@nestjs/testing';
import { AIExplanationService } from '../src/ai-explanation/ai-explanation.service';
import { ExplanationCacheService } from '../src/ai-explanation/cache/explanation-cache.service';
import { SkinTypeEnum } from '../src/recommendation/dto/recommendation-request.dto';

describe('AIExplanationService Unit & Integration Tests', () => {
  let explanationService: AIExplanationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AIExplanationService, ExplanationCacheService],
    }).compile();

    explanationService = module.get<AIExplanationService>(AIExplanationService);
  });

  it('should be defined', () => {
    expect(explanationService).toBeDefined();
  });

  describe('generateExplanation', () => {
    it('should generate explanation without altering deterministic scores or rankings', async () => {
      const mockResult = {
        morningRoutine: [],
        eveningRoutine: [],
        recommendedProducts: [
          {
            productId: 'p1',
            name: 'Gentle Cleanser',
            brand: 'Aesop',
            category: 'Cleanser',
            productType: 'CLEANSER',
            price: 39,
            currency: 'USD',
            score: 95,
            matchedRules: ['SKIN_TYPE_MATCH:COMBINATION'],
            rejectedRules: [],
            warnings: [],
          },
        ],
        avoidedProducts: [],
        ruleEvaluationSummary: {
          totalRulesEvaluated: 5,
          passedRulesCount: 5,
          failedRulesCount: 0,
          ruleLogs: [],
        },
        confidenceScore: 100,
      };

      const mockProfile = {
        skinType: SkinTypeEnum.COMBINATION,
        skinConcerns: ['acne'],
      };

      const explanation = await explanationService.generateExplanation('tenant_123', {
        recommendationResult: mockResult as any,
        customerProfile: mockProfile as any,
      });

      expect(explanation).toBeDefined();
      expect(explanation.summary).toContain('COMBINATION');
      expect(explanation.products).toHaveLength(1);
      expect(explanation.products[0].confidence).toBe(95); // Score preserved
    });
  });
});
