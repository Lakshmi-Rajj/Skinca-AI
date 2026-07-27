import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { CatalogModule } from '../catalog/catalog.module';
import { CustomerModule } from '../customer/customer.module';
import { RoutineModule } from '../routine/routine.module';
import {
  AuditLogRepository,
  TenantRepository,
} from '@platform/database-client';

@Module({
  imports: [CatalogModule, CustomerModule, RoutineModule],
  controllers: [AnalyticsController],
  providers: [AuditLogRepository, TenantRepository, AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
