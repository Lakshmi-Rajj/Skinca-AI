import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { CandidateProductGenerator } from './generator/candidate-product-generator';
import { KnowledgeModule } from '../knowledge/knowledge.module';

@Module({
  imports: [KnowledgeModule],
  controllers: [RecommendationController],
  providers: [RecommendationService, CandidateProductGenerator],
  exports: [RecommendationService, CandidateProductGenerator],
})
export class RecommendationModule {}
