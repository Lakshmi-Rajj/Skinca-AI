import { Controller, Get, Query, Param, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Analytics & Dashboard')
@ApiBearerAuth('bearer-auth')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get main dashboard KPIs and overview stats' })
  async getDashboardKpis(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: AnalyticsQueryDto,
  ): Promise<any> {
    return this.analyticsService.getDashboardKpis(tenantId || currentUser.tenantId, query);
  }

  @Get('customers')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get customer growth and breakdown analytics' })
  async getCustomerAnalytics(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: AnalyticsQueryDto,
  ): Promise<any> {
    return this.analyticsService.getCustomerAnalytics(tenantId || currentUser.tenantId, query);
  }

  @Get('recommendations')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get recommendation engine performance and confidence metrics' })
  async getRecommendationAnalytics(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: AnalyticsQueryDto,
  ): Promise<any> {
    return this.analyticsService.getRecommendationAnalytics(tenantId || currentUser.tenantId, query);
  }

  @Get('products')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get product recommendation popularity and ingredient usage analytics' })
  async getProductAnalytics(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: AnalyticsQueryDto,
  ): Promise<any> {
    return this.analyticsService.getProductAnalytics(tenantId || currentUser.tenantId, query);
  }

  @Get('ai')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get AI Explanation worker response time and cache metrics' })
  async getAIAnalytics(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: AnalyticsQueryDto,
  ): Promise<any> {
    return this.analyticsService.getAIAnalytics(tenantId || currentUser.tenantId, query);
  }

  @Get('tenants')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Get multi-tenant usage metrics' })
  async getTenantAnalytics(@Query() query: AnalyticsQueryDto): Promise<any> {
    return this.analyticsService.getTenantAnalytics(query);
  }

  @Get('export')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Export analytics reporting data' })
  async exportAnalyticsData(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query('format') format = 'csv',
  ): Promise<any> {
    return this.analyticsService.exportAnalyticsData(tenantId || currentUser.tenantId, format);
  }
}
