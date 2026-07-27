import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Tenant Management')
@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Provision a new tenant account and owner user' })
  @ApiResponse({ status: 201, description: 'Tenant provisioned successfully' })
  async createTenant(@Body() dto: CreateTenantDto): Promise<any> {
    return this.tenantService.createTenant(dto);
  }

  @Get('current')
  @ApiBearerAuth('bearer-auth')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get current tenant details' })
  @ApiResponse({ status: 200, description: 'Tenant details returned' })
  async getCurrentTenant(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any> {
    return this.tenantService.getTenantById(tenantId || currentUser.tenantId);
  }

  @Get('config')
  @ApiBearerAuth('bearer-auth')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get current tenant configuration and branding settings' })
  @ApiResponse({ status: 200, description: 'Tenant configuration returned' })
  async getTenantConfig(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any> {
    return this.tenantService.getTenantConfig(tenantId || currentUser.tenantId);
  }

  @Patch('config')
  @ApiBearerAuth('bearer-auth')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Update tenant configuration and branding settings' })
  @ApiResponse({ status: 200, description: 'Tenant configuration updated successfully' })
  async updateTenantConfig(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: UpdateTenantConfigDto,
  ): Promise<any> {
    return this.tenantService.updateTenantConfig(
      tenantId || currentUser.tenantId,
      dto,
      currentUser.userId,
    );
  }
}
