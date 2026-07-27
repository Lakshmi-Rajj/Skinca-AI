import { Module } from '@nestjs/common';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';
import { MorningRoutineBuilder } from './builders/morning-routine.builder';
import { EveningRoutineBuilder } from './builders/evening-routine.builder';
import { CustomerModule } from '../customer/customer.module';
import { RecommendationModule } from '../recommendation/recommendation.module';
import { AIExplanationModule } from '../ai-explanation/ai-explanation.module';

@Module({
  imports: [CustomerModule, RecommendationModule, AIExplanationModule],
  controllers: [RoutineController],
  providers: [RoutineService, MorningRoutineBuilder, EveningRoutineBuilder],
  exports: [RoutineService, MorningRoutineBuilder, EveningRoutineBuilder],
})
export class RoutineModule {}
