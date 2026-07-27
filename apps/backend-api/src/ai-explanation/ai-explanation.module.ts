import { Module } from '@nestjs/common';
import { AIExplanationController } from './ai-explanation.controller';
import { AIExplanationService } from './ai-explanation.service';
import { ExplanationCacheService } from './cache/explanation-cache.service';

@Module({
  controllers: [AIExplanationController],
  providers: [AIExplanationService, ExplanationCacheService],
  exports: [AIExplanationService, ExplanationCacheService],
})
export class AIExplanationModule {}
