import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from '../src/recommendation/recommendation.service';
import { KnowledgeService } from '../src/knowledge/services/knowledge.service';
import { KnowledgeCacheService } from '../src/knowledge/cache/knowledge-cache.service';
import { SkinTypeEnum } from '../src/recommendation/dto/recommendation-request.dto';

describe('RecommendationService Unit Tests', () => {
  let recommendationService: RecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        KnowledgeService,
        KnowledgeCacheService,
      ],
    }).compile();

    recommendationService = module.get<RecommendationService>(RecommendationService);
  });

  it('should be defined', () => {
    expect(recommendationService).toBeDefined();
  });

  describe('generateRecommendation', () => {
    it('should generate deterministic recommendation outputs without error', async () => {
      const mockResult = await recommendationService.generateRecommendation('tenant_123', {
        skinType: SkinTypeEnum.COMBINATION,
        skinConcerns: ['acne', 'hyperpigmentation'],
        age: 26,
        isPregnant: false,
        allergies: [],
      });

      expect(mockResult).toBeDefined();
      expect(mockResult.morningRoutine).toBeDefined();
      expect(mockResult.eveningRoutine).toBeDefined();
      expect(mockResult.ruleEvaluationSummary).toBeDefined();
    });
  });
});
