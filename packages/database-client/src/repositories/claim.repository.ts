import { ProductClaim, Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface IClaimRepository {
  findAll(tenantId: string, options?: { page?: number; limit?: number; search?: string }): Promise<{ items: ProductClaim[]; total: number }>;
  findById(tenantId: string, id: string): Promise<ProductClaim | null>;
  findBySlug(tenantId: string, slug: string): Promise<ProductClaim | null>;
  create(data: Prisma.ProductClaimCreateInput): Promise<ProductClaim>;
  update(tenantId: string, id: string, data: Prisma.ProductClaimUpdateInput): Promise<ProductClaim>;
  delete(tenantId: string, id: string): Promise<ProductClaim>;
}

export class ClaimRepository implements IClaimRepository {
  async findAll(
    tenantId: string,
    options: { page?: number; limit?: number; search?: string } = {},
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductClaimWhereInput = {
      tenantId,
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
      prisma.productClaim.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.productClaim.count({ where }),
    ]);

    return { items, total };
  }

  async findById(tenantId: string, id: string) {
    return prisma.productClaim.findFirst({
      where: { id, tenantId },
    });
  }

  async findBySlug(tenantId: string, slug: string) {
    return prisma.productClaim.findFirst({
      where: { slug, tenantId },
    });
  }

  async create(data: Prisma.ProductClaimCreateInput) {
    return prisma.productClaim.create({
      data,
    });
  }

  async update(tenantId: string, id: string, data: Prisma.ProductClaimUpdateInput) {
    return prisma.productClaim.update({
      where: { id, tenantId },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    return prisma.productClaim.delete({
      where: { id, tenantId },
    });
  }
}
