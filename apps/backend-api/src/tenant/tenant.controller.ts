import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ForbiddenException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Tenant, TenantConfiguration } from '@platform/database-client';
import { TenantService, PaginatedTenantsResult } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Tenant')
@ApiBearerAuth('bearer-auth')
@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Post()
  @Permissions('tenant:write')
  @ApiOperation({ summary: 'Create a new tenant organization' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @ApiResponse({ status: 409, description: 'Subdomain already registered' })
  async create(
    @Body() dto: CreateTenantDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<Tenant & { configuration: TenantConfiguration | null }> {
    return this.tenantService.create(dto, currentUser);
  }

  @Get()
  @Permissions('tenant:read')
  @ApiOperation({ summary: 'List all tenant organizations (Paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedTenantsResult> {
    return this.tenantService.findAll(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
  }

  @Get(':id')
  @Permissions('tenant:read')
  @ApiOperation({ summary: 'Get tenant details by ID' })
  @ApiResponse({ status: 200, description: 'Tenant found' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<Tenant & { configuration: TenantConfiguration | null }> {
    this.enforceTenantAccess(id, currentUser);
    return this.tenantService.findById(id);
  }

  @Patch(':id')
  @Permissions('tenant:write')
  @ApiOperation({ summary: 'Update tenant metadata, status, or subscription tier' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTenantDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<Tenant & { configuration: TenantConfiguration | null }> {
    this.enforceTenantAccess(id, currentUser);
    return this.tenantService.update(id, dto, currentUser);
  }

  @Delete(':id')
  @Permissions('tenant:write')
  @ApiOperation({ summary: 'Soft delete tenant organization' })
  @ApiResponse({ status: 200, description: 'Tenant soft deleted' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async softDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<Tenant> {
    return this.tenantService.softDelete(id, currentUser);
  }

  @Get(':id/config')
  @Permissions('tenant:config:read')
  @ApiOperation({ summary: 'Get tenant branding, widget placement, and feature configuration' })
  @ApiResponse({ status: 200, description: 'Tenant configuration retrieved' })
  @ApiResponse({ status: 404, description: 'Tenant configuration not found' })
  async getConfig(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<TenantConfiguration> {
    this.enforceTenantAccess(id, currentUser);
    return this.tenantService.getConfig(id);
  }

  @Put(':id/config')
  @Permissions('tenant:config:write')
  @ApiOperation({ summary: 'Update tenant branding, widget placement, and feature configuration' })
  @ApiResponse({ status: 200, description: 'Tenant configuration updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant configuration not found' })
  async updateConfig(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTenantConfigDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<TenantConfiguration> {
    this.enforceTenantAccess(id, currentUser);
    return this.tenantService.updateConfig(id, dto, currentUser);
  }

  private enforceTenantAccess(targetTenantId: string, user: AuthenticatedUser) {
    if (user.role === 'PLATFORM_ADMIN') {
      return;
    }
    if (user.tenantId !== targetTenantId) {
      throw new ForbiddenException('Access denied: Cannot access or mutate another tenant organization');
    }
  }
}
