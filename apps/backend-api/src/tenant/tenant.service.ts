import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Tenant, TenantConfiguration, TenantRepository } from '@platform/database-client';
import { AuditService } from '../audit/audit.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

export interface PaginatedTenantsResult {
  items: (Tenant & { configuration: TenantConfiguration | null })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class TenantService {
  private tenantRepository = new TenantRepository();

  constructor(private auditService: AuditService) {}

  async findAll(page = 1, limit = 20): Promise<PaginatedTenantsResult> {
    const { items, total } = await this.tenantRepository.findAll({ page, limit });
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Tenant & { configuration: TenantConfiguration | null }> {
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async findBySubdomain(subdomain: string): Promise<Tenant & { configuration: TenantConfiguration | null }> {
    const tenant = await this.tenantRepository.findBySubdomain(subdomain);
    if (!tenant) {
      throw new NotFoundException(`Tenant with subdomain ${subdomain} not found`);
    }
    return tenant;
  }

  async create(dto: CreateTenantDto, currentUser?: AuthenticatedUser): Promise<Tenant & { configuration: TenantConfiguration | null }> {
    const existing = await this.tenantRepository.findBySubdomain(dto.subdomain);
    if (existing) {
      throw new ConflictException(`Subdomain '${dto.subdomain}' is already registered`);
    }

    const tenant = await this.tenantRepository.create({
      name: dto.name,
      subdomain: dto.subdomain,
      subscriptionTier: dto.subscriptionTier || 'STARTER',
      configuration: {
        create: {
          brandName: dto.name,
          primaryColor: '#000000',
          accentColor: '#FFFFFF',
          widgetPosition: 'BOTTOM_RIGHT',
          featureFlags: {},
        },
      },
    });

    await this.auditService.logAction({
      tenantId: tenant.id,
      userId: currentUser?.userId,
      action: 'TENANT_CREATED',
      entityType: 'TENANT',
      entityId: tenant.id,
      payload: { name: tenant.name, subdomain: tenant.subdomain, subscriptionTier: tenant.subscriptionTier },
    });

    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto, currentUser?: AuthenticatedUser): Promise<Tenant & { configuration: TenantConfiguration | null }> {
    const tenant = await this.findById(id);

    const subscriptionChanged = dto.subscriptionTier && dto.subscriptionTier !== tenant.subscriptionTier;

    const updated = await this.tenantRepository.update(id, {
      name: dto.name,
      status: dto.status,
      subscriptionTier: dto.subscriptionTier,
    });

    await this.auditService.logAction({
      tenantId: id,
      userId: currentUser?.userId,
      action: 'TENANT_UPDATED',
      entityType: 'TENANT',
      entityId: id,
      payload: dto,
    });

    if (subscriptionChanged) {
      await this.auditService.logAction({
        tenantId: id,
        userId: currentUser?.userId,
        action: 'SUBSCRIPTION_CHANGED',
        entityType: 'TENANT',
        entityId: id,
        payload: { oldTier: tenant.subscriptionTier, newTier: dto.subscriptionTier },
      });
    }

    return updated;
  }

  async softDelete(id: string, currentUser?: AuthenticatedUser): Promise<Tenant> {
    await this.findById(id);
    const deleted = await this.tenantRepository.softDelete(id);

    await this.auditService.logAction({
      tenantId: id,
      userId: currentUser?.userId,
      action: 'TENANT_DELETED',
      entityType: 'TENANT',
      entityId: id,
    });

    return deleted;
  }

  async getConfig(tenantId: string): Promise<TenantConfiguration> {
    await this.findById(tenantId);
    const config = await this.tenantRepository.findConfiguration(tenantId);
    if (!config) {
      throw new NotFoundException(`Tenant configuration for ID ${tenantId} not found`);
    }
    return config;
  }

  async updateConfig(tenantId: string, dto: UpdateTenantConfigDto, currentUser?: AuthenticatedUser): Promise<TenantConfiguration> {
    await this.findById(tenantId);

    const config = await this.tenantRepository.upsertConfiguration(tenantId, dto);

    await this.auditService.logAction({
      tenantId,
      userId: currentUser?.userId,
      action: 'TENANT_CONFIGURATION_UPDATED',
      entityType: 'TENANT_CONFIGURATION',
      entityId: config.id,
      payload: dto,
    });

    return config;
  }
}
