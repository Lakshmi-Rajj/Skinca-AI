import { Ingredient, IngredientAlias, Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface IngredientQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  functionName?: string;
  skinType?: string;
  skinConcern?: string;
}

export type IngredientWithAliases = Ingredient & { aliases: IngredientAlias[] };

export class IngredientRepository {
  async findAll(options: IngredientQueryOptions = {}): Promise<{ items: IngredientWithAliases[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.IngredientWhereInput = {};

    if (options.functionName) {
      where.functions = { has: options.functionName };
    }

    if (options.skinType) {
      where.skinTypes = { has: options.skinType };
    }

    if (options.skinConcern) {
      where.skinConcerns = { has: options.skinConcern };
    }

    if (options.search) {
      where.OR = [
        { inciName: { contains: options.search, mode: 'insensitive' } },
        { displayName: { contains: options.search, mode: 'insensitive' } },
        { aliases: { some: { alias: { contains: options.search, mode: 'insensitive' } } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.ingredient.findMany({
        where,
        include: { aliases: true },
        skip,
        take: limit,
        orderBy: { inciName: 'asc' },
      }),
      prisma.ingredient.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<IngredientWithAliases | null> {
    return prisma.ingredient.findUnique({
      where: { id },
      include: { aliases: true },
    });
  }

  async findByInciName(inciName: string): Promise<IngredientWithAliases | null> {
    return prisma.ingredient.findUnique({
      where: { inciName },
      include: { aliases: true },
    });
  }

  async create(data: Prisma.IngredientCreateInput): Promise<IngredientWithAliases> {
    return prisma.ingredient.create({
      data,
      include: { aliases: true },
    });
  }

  async updateProductFormulation(
    productId: string,
    formulationItems: {
      ingredientId: string;
      displayOrder?: number;
      declaredConcentration?: number;
      approximateRange?: string;
      isPrimaryActive?: boolean;
    }[],
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.productIngredient.deleteMany({
        where: { productId },
      });

      if (formulationItems.length > 0) {
        await tx.productIngredient.createMany({
          data: formulationItems.map((item, idx) => ({
            productId,
            ingredientId: item.ingredientId,
            displayOrder: item.displayOrder !== undefined ? item.displayOrder : idx,
            declaredConcentration: item.declaredConcentration,
            approximateRange: item.approximateRange,
            isPrimaryActive: item.isPrimaryActive || false,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: productId },
        include: {
          formulation: {
            include: { ingredient: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
    });
  }
}
