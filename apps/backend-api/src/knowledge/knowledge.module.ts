import { Module } from '@nestjs/common';
import { KnowledgeController } from './controllers/knowledge.controller';
import { KnowledgeService } from './services/knowledge.service';
import { KnowledgeCacheService } from './cache/knowledge-cache.service';

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService, KnowledgeCacheService],
  exports: [KnowledgeService, KnowledgeCacheService],
})
export class KnowledgeModule {}
