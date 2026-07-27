import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import {
  CustomerRepository,
  SkinProfileRepository,
  AssessmentRepository,
  RecommendationHistoryRepository,
} from '@platform/database-client';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerRepository,
    SkinProfileRepository,
    AssessmentRepository,
    RecommendationHistoryRepository,
    CustomerService,
  ],
  exports: [
    CustomerRepository,
    SkinProfileRepository,
    AssessmentRepository,
    RecommendationHistoryRepository,
    CustomerService,
  ],
})
export class CustomerModule {}
