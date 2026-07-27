import { Product, ProductImage, ProductIngredient, Ingredient, Prisma, ProductStatus } from '@prisma/client';
import { prisma } from '../client';

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductStatus;
  categoryId?: string;
  sortBy?: 'name' | 'createdAt' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export type ProductWithDetails = Product & {
  images: ProductImage[];
  category: { id: string; name: string; slug: string };
  formulation: (ProductIngredient & { ingredient: Ingredient })[];
};

export class ProductRepository {
  async findAll(tenantId: string, options: ProductQueryOptions = {}): Promise<{ items: ProductWithDetails[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (options.status) {
      where.status = options.status;
    }

    if (options.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { sku: { contains: options.search, mode: 'insensitive' } },
        { brand: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    const sortField = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    orderBy[sortField] = sortOrder;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          category: { select: { id: true, name: true, slug: true } },
          formulation: { include: { ingredient: true }, orderBy: { displayOrder: 'asc' } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  async findById(tenantId: string, id: string): Promise<ProductWithDetails | null> {
    return prisma.product.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        formulation: { include: { ingredient: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async findBySku(tenantId: string, sku: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: { tenantId, sku, deletedAt: null },
    });
  }

  async findBySlug(tenantId: string, slug: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: { tenantId, slug, deletedAt: null },
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<ProductWithDetails> {
    return prisma.product.create({
      data,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        formulation: { include: { ingredient: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async update(tenantId: string, id: string, data: Prisma.ProductUpdateInput): Promise<ProductWithDetails> {
    return prisma.product.update({
      where: { id, tenantId },
      data,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        formulation: { include: { ingredient: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async softDelete(tenantId: string, id: string): Promise<Product> {
    return prisma.product.update({
      where: { id, tenantId },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });
  }
}
