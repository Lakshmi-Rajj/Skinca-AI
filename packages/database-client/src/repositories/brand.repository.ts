import { Brand, Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface IBrandRepository {
  findAll(tenantId: string, options?: { page?: number; limit?: number; search?: string }): Promise<{ items: Brand[]; total: number }>;
  findById(tenantId: string, id: string): Promise<Brand | null>;
  findBySlug(tenantId: string, slug: string): Promise<Brand | null>;
  create(data: Prisma.BrandCreateInput): Promise<Brand>;
  update(tenantId: string, id: string, data: Prisma.BrandUpdateInput): Promise<Brand>;
  softDelete(tenantId: string, id: string): Promise<Brand>;
}

export class BrandRepository implements IBrandRepository {
  async findAll(
    tenantId: string,
    options: { page?: number; limit?: number; search?: string } = {},
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.BrandWhereInput = {
      tenantId,
      deletedAt: null,
      ...(options.search
        ? {
            OR: [
              { name: { contains: options.search, mode: 'insensitive' } },
              { slug: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.brand.count({ where }),
    ]);

    return { items, total };
  }

  async findById(tenantId: string, id: string) {
    return prisma.brand.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findBySlug(tenantId: string, slug: string) {
    return prisma.brand.findFirst({
      where: { slug, tenantId, deletedAt: null },
    });
  }

  async create(data: Prisma.BrandCreateInput) {
    return prisma.brand.create({
      data,
    });
  }

  async update(tenantId: string, id: string, data: Prisma.BrandUpdateInput) {
    return prisma.brand.update({
      where: { id, tenantId },
      data,
    });
  }

  async softDelete(tenantId: string, id: string) {
    return prisma.brand.update({
      where: { id, tenantId },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });
  }
}
