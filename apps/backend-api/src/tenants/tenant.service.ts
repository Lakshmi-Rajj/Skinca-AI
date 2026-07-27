import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { TenantRepository, UserRepository, RoleRepository } from '@platform/database-client';
import { PasswordHasher } from '../auth/utils/password-hasher.util';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TenantService {
  private tenantRepository = new TenantRepository();
  private userRepository = new UserRepository();
  private roleRepository = new RoleRepository();

  constructor(private auditService: AuditService) {}

  async createTenant(dto: CreateTenantDto): Promise<any> {
    const existing = await this.tenantRepository.findBySubdomain(dto.subdomain);
    if (existing) {
      throw new ConflictException('Subdomain is already registered');
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
          defaultLanguage: 'en',
          timeZone: 'UTC',
        },
      },
    });

    const ownerRole = await this.roleRepository.create({
      tenant: { connect: { id: tenant.id } },
      name: 'OWNER',
      description: 'Full tenant owner with unrestricted administrative access',
      isSystem: true,
    });

    await this.roleRepository.create({
      tenant: { connect: { id: tenant.id } },
      name: 'ADMIN',
      description: 'Tenant administrator',
      isSystem: true,
    });

    await this.roleRepository.create({
      tenant: { connect: { id: tenant.id } },
      name: 'MANAGER',
      description: 'Storefront manager and catalog editor',
      isSystem: true,
    });

    await this.roleRepository.create({
      tenant: { connect: { id: tenant.id } },
      name: 'STAFF',
      description: 'Staff operator with read/write access to products',
      isSystem: true,
    });

    await this.roleRepository.create({
      tenant: { connect: { id: tenant.id } },
      name: 'VIEWER',
      description: 'Read-only analytics and catalog viewer',
      isSystem: true,
    });

    const ownerPasswordHash = await PasswordHasher.hash(dto.ownerPassword);
    const ownerUser = await this.userRepository.create({
      tenant: { connect: { id: tenant.id } },
      role: { connect: { id: ownerRole.id } },
      email: dto.ownerEmail,
      passwordHash: ownerPasswordHash,
      firstName: dto.ownerFirstName,
      lastName: dto.ownerLastName,
      isEmailVerified: true,
    });

    await this.auditService.logAction({
      tenantId: tenant.id,
      userId: ownerUser.id,
      action: 'TENANT_PROVISIONED',
      entityType: 'TENANT',
      entityId: tenant.id,
      payload: { name: tenant.name, subdomain: tenant.subdomain },
    });

    return {
      tenant,
      owner: {
        id: ownerUser.id,
        email: ownerUser.email,
        firstName: ownerUser.firstName,
        lastName: ownerUser.lastName,
      },
    };
  }

  async getTenantById(tenantId: string): Promise<any> {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant || tenant.deletedAt) {
      throw new NotFoundException('Tenant account not found');
    }
    return tenant;
  }

  async getTenantConfig(tenantId: string): Promise<any> {
    const config = await this.tenantRepository.findConfigByTenantId(tenantId);
    if (!config) {
      throw new NotFoundException('Tenant configuration not found');
    }
    return config;
  }

  async updateTenantConfig(tenantId: string, dto: UpdateTenantConfigDto, currentUserId: string): Promise<any> {
    const config = await this.tenantRepository.updateConfig(tenantId, {
      ...dto,
      updatedBy: currentUserId,
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'TENANT_CONFIG_UPDATED',
      entityType: 'TENANT_CONFIGURATION',
      entityId: config.id,
      payload: dto as Record<string, unknown>,
    });

    return config;
  }
}
