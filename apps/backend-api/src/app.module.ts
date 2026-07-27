import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigurationModule } from './config/configuration.module';
import { TenantContextModule } from './tenant-context/tenant-context.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { CatalogModule } from './catalog/catalog.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AIExplanationModule } from './ai-explanation/ai-explanation.module';
import { CustomerModule } from './customer/customer.module';
import { RoutineModule } from './routine/routine.module';
import { WidgetModule } from './widget/widget.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { VersionModule } from './version/version.module';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';

@Module({
  imports: [
    ConfigurationModule,
    TenantContextModule,
    AuditModule,
    AuthModule,
    TenantModule,
    TenantsModule,
    UsersModule,
    CatalogModule,
    IngredientModule,
    KnowledgeModule,
    RecommendationModule,
    AIExplanationModule,
    CustomerModule,
    RoutineModule,
    WidgetModule,
    AdminModule,
    HealthModule,
    VersionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
