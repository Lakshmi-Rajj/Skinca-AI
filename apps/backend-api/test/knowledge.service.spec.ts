import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeService } from '../src/knowledge/services/knowledge.service';
import { KnowledgeCacheService } from '../src/knowledge/cache/knowledge-cache.service';

describe('KnowledgeService Unit Tests', () => {
  let knowledgeService: KnowledgeService;
  let cacheService: KnowledgeCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeService, KnowledgeCacheService],
    }).compile();

    knowledgeService = module.get<KnowledgeService>(KnowledgeService);
    cacheService = module.get<KnowledgeCacheService>(KnowledgeCacheService);
  });

  it('should be defined', () => {
    expect(knowledgeService).toBeDefined();
    expect(cacheService).toBeDefined();
  });

  describe('checkCompatibility', () => {
    it('should identify conflicting active pair Retinol + Salicylic Acid', async () => {
      const result = await knowledgeService.checkCompatibility('Retinol', 'Salicylic Acid');
      expect(result.compatible).toBe(false);
      expect(result.isConflict).toBe(true);
    });

    it('should identify synergistic pair Ascorbic Acid + Ferulic Acid', async () => {
      const result = await knowledgeService.checkCompatibility('Ascorbic Acid', 'Ferulic Acid');
      expect(result.compatible).toBe(true);
      expect(result.isSynergistic).toBe(true);
    });
  });
});
