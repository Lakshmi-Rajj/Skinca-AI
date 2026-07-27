import { Tenant, TenantConfiguration, Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface ITenantRepository {
  findAll(options?: { page?: number; limit?: number }): Promise<{ items: (Tenant & { configuration: TenantConfiguration | null })[]; total: number }>;
  findById(id: string): Promise<(Tenant & { configuration: TenantConfiguration | null }) | null>;
  findBySubdomain(subdomain: string): Promise<(Tenant & { configuration: TenantConfiguration | null }) | null>;
  create(data: Prisma.TenantCreateInput): Promise<Tenant & { configuration: TenantConfiguration | null }>;
  update(id: string, data: Prisma.TenantUpdateInput): Promise<Tenant & { configuration: TenantConfiguration | null }>;
  softDelete(id: string): Promise<Tenant>;
  findConfiguration(tenantId: string): Promise<TenantConfiguration | null>;
  upsertConfiguration(tenantId: string, data: Partial<Prisma.TenantConfigurationCreateWithoutTenantInput>): Promise<TenantConfiguration>;
}

export class TenantRepository implements ITenantRepository {
  async findAll(options: { page?: number; limit?: number } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.tenant.findMany({
        where: { deletedAt: null },
        include: { configuration: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tenant.count({
        where: { deletedAt: null },
      }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.tenant.findFirst({
      where: { id, deletedAt: null },
      include: { configuration: true },
    });
  }

  async findBySubdomain(subdomain: string) {
    return prisma.tenant.findFirst({
      where: { subdomain, deletedAt: null },
      include: { configuration: true },
    });
  }

  async create(data: Prisma.TenantCreateInput) {
    return prisma.tenant.create({
      data,
      include: { configuration: true },
    });
  }

  async update(id: string, data: Prisma.TenantUpdateInput) {
    return prisma.tenant.update({
      where: { id },
      data,
      include: { configuration: true },
    });
  }

  async softDelete(id: string) {
    return prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });
  }

  async findConfiguration(tenantId: string) {
    return prisma.tenantConfiguration.findUnique({
      where: { tenantId },
    });
  }

  async upsertConfiguration(
    tenantId: string,
    data: Partial<Prisma.TenantConfigurationCreateWithoutTenantInput>,
  ) {
    return prisma.tenantConfiguration.upsert({
      where: { tenantId },
      update: data,
      create: {
        tenantId,
        brandName: data.brandName,
        primaryColor: data.primaryColor || '#000000',
        accentColor: data.accentColor || '#FFFFFF',
        logoUrl: data.logoUrl,
        widgetPosition: data.widgetPosition || 'BOTTOM_RIGHT',
        featureFlags: data.featureFlags || {},
        defaultLanguage: data.defaultLanguage || 'en',
        timeZone: data.timeZone || 'UTC',
      },
    });
  }
}
