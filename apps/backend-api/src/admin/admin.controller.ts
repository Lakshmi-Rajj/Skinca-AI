import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService, DashboardMetrics, AnalyticsSummary } from './admin.service';
import { AdminQueryDto } from './dto/admin-query.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Admin Dashboard & Operations')
@ApiBearerAuth('bearer-auth')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @Permissions('tenant:read')
  @ApiOperation({ summary: 'Get administrative dashboard metrics and system status' })
  @ApiResponse({ status: 200, description: 'Dashboard summary metrics returned' })
  async getDashboard(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<DashboardMetrics> {
    return this.adminService.getDashboardSummary(tenantId || currentUser.tenantId);
  }

  @Get('analytics')
  @Permissions('analytics:summary:read')
  @ApiOperation({ summary: 'Get backend recommendation analytics and ingredient trends' })
  @ApiResponse({ status: 200, description: 'Analytics summary returned' })
  async getAnalytics(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<AnalyticsSummary> {
    return this.adminService.getAnalytics(tenantId || currentUser.tenantId);
  }

  @Get('recommendation-history')
  @Permissions('analytics:summary:read')
  @ApiOperation({ summary: 'List historical recommendation decision events (Paginated)' })
  @ApiResponse({ status: 200, description: 'Recommendation history returned' })
  async getRecommendationHistory(
    @CurrentTenant() tenantId: string,
    @Query() query: AdminQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any> {
    return this.adminService.getRecommendationHistory(tenantId || currentUser.tenantId, query);
  }

  @Get('audit-logs')
  @Permissions('tenant:read')
  @ApiOperation({ summary: 'Query security audit logs (Paginated)' })
  @ApiResponse({ status: 200, description: 'Audit log entries returned' })
  async getAuditLogs(
    @CurrentTenant() tenantId: string,
    @Query() query: AdminQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any> {
    return this.adminService.getAuditLogs(tenantId || currentUser.tenantId, query);
  }

  @Get('search')
  @Permissions('tenant:read')
  @ApiOperation({ summary: 'Global administrative search across products, ingredients, and users' })
  @ApiResponse({ status: 200, description: 'Search results returned' })
  async globalSearch(
    @CurrentTenant() tenantId: string,
    @Query('q') q: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any> {
    return this.adminService.globalSearch(tenantId || currentUser.tenantId, q);
  }

  @Get('export')
  @Permissions('tenant:read')
  @ApiOperation({ summary: 'Export system metadata or product catalog' })
  @ApiResponse({ status: 200, description: 'Export payload returned' })
  async exportData(
    @CurrentTenant() tenantId: string,
    @Query('entity') entity?: string,
    @Query('format') format?: string,
    @CurrentUser() currentUser?: AuthenticatedUser,
  ): Promise<any> {
    return this.adminService.exportData(
      tenantId || currentUser?.tenantId,
      entity || 'products',
      format || 'json',
    );
  }
}
