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
