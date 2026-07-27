import { ProductCategory, Prisma } from '@prisma/client';
import { prisma } from '../client';

export class CategoryRepository {
  async findAll(tenantId?: string): Promise<ProductCategory[]> {
    return prisma.productCategory.findMany({
      where: {
        deletedAt: null,
        OR: tenantId ? [{ tenantId: null }, { tenantId }] : [{ tenantId: null }],
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findById(id: string): Promise<ProductCategory | null> {
    return prisma.productCategory.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: Prisma.ProductCategoryCreateInput): Promise<ProductCategory> {
    return prisma.productCategory.create({
      data,
    });
  }
}
