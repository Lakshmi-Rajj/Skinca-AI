import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  ProductRepository,
  IngredientRepository,
  CategoryRepository,
  BrandRepository,
  ProductQueryOptions,
} from '@platform/database-client';
import { CreateProductDto } from './dto/create-product.dto';
import { BulkImportDto } from './dto/bulk-import.dto';
import { AuditService } from '../audit/audit.service';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class ProductCatalogService {
  private productRepository = new ProductRepository();
  private ingredientRepository = new IngredientRepository();
  private categoryRepository = new CategoryRepository();
  private brandRepository = new BrandRepository();

  constructor(private auditService: AuditService) {}

  async searchProducts(tenantId: string, options: ProductQueryOptions): Promise<any> {
    return this.productRepository.findAll(tenantId, options);
  }

  async findProductById(tenantId: string, id: string): Promise<any> {
    const product = await this.productRepository.findById(tenantId, id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async createProduct(tenantId: string, dto: CreateProductDto, currentUserId: string): Promise<any> {
    const existingSku = await this.productRepository.findBySku(tenantId, dto.sku);
    if (existingSku) {
      throw new ConflictException('A product with this SKU already exists');
    }

    const slug = slugify(dto.name);
    const existingSlug = await this.productRepository.findBySlug(tenantId, slug);
    if (existingSlug) {
      throw new ConflictException('A product with this name already exists');
    }

    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new BadRequestException('Specified product category does not exist');
    }

    let brandName = dto.brandName;
    if (dto.brandId) {
      const brand = await this.brandRepository.findById(tenantId, dto.brandId);
      if (brand) {
        brandName = brand.name;
      }
    }

    const product = await this.productRepository.create({
      tenant: { connect: { id: tenantId } },
      category: { connect: { id: dto.categoryId } },
      name: dto.name,
      slug,
      brandName,
      sku: dto.sku,
      barcode: dto.barcode,
      shortDescription: dto.shortDescription,
      longDescription: dto.longDescription,
      instructions: dto.instructions,
      productType: dto.productType,
      status: dto.status || 'DRAFT',
      price: dto.price ? Number(dto.price) : undefined,
      currency: dto.currency || 'USD',
      tags: dto.tags || [],
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      createdBy: currentUserId,
      ...(dto.brandId ? { brand: { connect: { id: dto.brandId } } } : {}),
      ...(dto.claimIds && dto.claimIds.length > 0
        ? { claims: { connect: dto.claimIds.map((id) => ({ id })) } }
        : {}),
      ...(dto.images && dto.images.length > 0
        ? {
            images: {
              createMany: {
                data: dto.images.map((img, index) => ({
                  url: img.url,
                  altText: img.altText,
                  displayOrder: img.displayOrder ?? index,
                  isPrimary: img.isPrimary ?? index === 0,
                })),
              },
            },
          }
        : {}),
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'PRODUCT_CREATED',
      entityType: 'PRODUCT',
      entityId: product.id,
      payload: { name: product.name, sku: product.sku },
    });

    return product;
  }

  async archiveProduct(tenantId: string, id: string, currentUserId: string): Promise<{ message: string }> {
    const product = await this.productRepository.findById(tenantId, id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.softDelete(tenantId, id);

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'PRODUCT_ARCHIVED',
      entityType: 'PRODUCT',
      entityId: id,
    });

    return { message: 'Product archived successfully' };
  }

  async bulkImportProducts(tenantId: string, dto: BulkImportDto, currentUserId: string): Promise<{ importedCount: number }> {
    let count = 0;
    for (const record of dto.records) {
      if (!record.name || !record.sku || !record.categoryId) continue;
      const slug = slugify(record.name);

      const existingSku = await this.productRepository.findBySku(tenantId, record.sku);
      if (existingSku) continue;

      await this.productRepository.create({
        tenant: { connect: { id: tenantId } },
        category: { connect: { id: record.categoryId } },
        name: record.name,
        slug,
        sku: record.sku,
        brandName: record.brandName || record.brand,
        price: record.price ? Number(record.price) : undefined,
        status: record.status || 'DRAFT',
        createdBy: currentUserId,
      });
      count++;
    }

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'PRODUCTS_BULK_IMPORTED',
      entityType: 'PRODUCT',
      payload: { count },
    });

    return { importedCount: count };
  }

  async bulkExportProducts(tenantId: string): Promise<any[]> {
    const { items } = await this.productRepository.findAll(tenantId, { limit: 1000 });
    return items.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      brand: p.brandName,
      category: p.category.name,
      price: p.price,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt,
    }));
  }

  // Ingredients Search & Management
  async searchIngredients(options: { page?: number; limit?: number; search?: string }): Promise<any> {
    return this.ingredientRepository.findAll(options);
  }

  async findIngredientById(id: string): Promise<any> {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }
    return ingredient;
  }

  async bulkImportIngredients(dto: BulkImportDto, currentUserId: string): Promise<{ importedCount: number }> {
    let count = 0;
    for (const record of dto.records) {
      if (!record.inciName || !record.displayName) continue;
      const existing = await this.ingredientRepository.findByInciName(record.inciName);
      if (existing) continue;

      await this.ingredientRepository.create({
        inciName: record.inciName,
        displayName: record.displayName,
        description: record.description,
        category: record.category,
        functions: record.functions || [],
        waterSoluble: record.waterSoluble ?? false,
        oilSoluble: record.oilSoluble ?? false,
      });
      count++;
    }

    return { importedCount: count };
  }

  async bulkExportIngredients(): Promise<any[]> {
    const { items } = await this.ingredientRepository.findAll({ limit: 1000 });
    return items.map((ing) => ({
      id: ing.id,
      inciName: ing.inciName,
      displayName: ing.displayName,
      category: ing.category,
      functions: ing.functions.join(', '),
      irritationRisk: ing.irritationRisk,
    }));
  }
}
