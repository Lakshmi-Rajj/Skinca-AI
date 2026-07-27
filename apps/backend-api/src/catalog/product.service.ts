import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository, CategoryRepository, ProductWithDetails, Product } from '@platform/database-client';
import { AuditService } from '../audit/audit.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

export interface PaginatedProductsResult {
  items: ProductWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductService {
  private productRepository = new ProductRepository();
  private categoryRepository = new CategoryRepository();

  constructor(private auditService: AuditService) {}

  async findAll(tenantId: string, query: ProductQueryDto): Promise<PaginatedProductsResult> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const { items, total } = await this.productRepository.findAll(tenantId, query);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(tenantId: string, id: string): Promise<ProductWithDetails> {
    const product = await this.productRepository.findById(tenantId, id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found for tenant`);
    }
    return product;
  }

  async create(tenantId: string, dto: CreateProductDto, currentUser?: AuthenticatedUser): Promise<ProductWithDetails> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
    }

    const existingSku = await this.productRepository.findBySku(tenantId, dto.sku);
    if (existingSku) {
      throw new ConflictException(`SKU '${dto.sku}' is already registered for this tenant`);
    }

    const slug = this.slugify(dto.name);

    const product = await this.productRepository.create({
      tenant: { connect: { id: tenantId } },
      category: { connect: { id: dto.categoryId } },
      name: dto.name,
      slug,
      sku: dto.sku,
      brand: dto.brand,
      shortDescription: dto.shortDescription,
      longDescription: dto.longDescription,
      productType: dto.productType,
      status: dto.status || 'DRAFT',
      price: dto.price,
      currency: dto.currency || 'USD',
      images: dto.images && dto.images.length > 0
        ? {
            create: dto.images.map((img, idx) => ({
              url: img.url,
              altText: img.altText,
              displayOrder: img.displayOrder !== undefined ? img.displayOrder : idx,
              isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            })),
          }
        : undefined,
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUser?.userId,
      action: 'PRODUCT_CREATED',
      entityType: 'PRODUCT',
      entityId: product.id,
      payload: { name: product.name, sku: product.sku, status: product.status },
    });

    return product;
  }

  async update(tenantId: string, id: string, dto: UpdateProductDto, currentUser?: AuthenticatedUser): Promise<ProductWithDetails> {
    const existing = await this.findById(tenantId, id);

    if (dto.sku && dto.sku !== existing.sku) {
      const existingSku = await this.productRepository.findBySku(tenantId, dto.sku);
      if (existingSku) {
        throw new ConflictException(`SKU '${dto.sku}' is already registered for this tenant`);
      }
    }

    const statusChanged = dto.status && dto.status !== existing.status;

    const updated = await this.productRepository.update(tenantId, id, {
      name: dto.name,
      slug: dto.name ? this.slugify(dto.name) : undefined,
      sku: dto.sku,
      brand: dto.brand,
      shortDescription: dto.shortDescription,
      longDescription: dto.longDescription,
      productType: dto.productType,
      status: dto.status,
      price: dto.price,
      currency: dto.currency,
      category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUser?.userId,
      action: 'PRODUCT_UPDATED',
      entityType: 'PRODUCT',
      entityId: id,
      payload: dto,
    });

    if (statusChanged) {
      await this.auditService.logAction({
        tenantId,
        userId: currentUser?.userId,
        action: 'PRODUCT_STATUS_CHANGED',
        entityType: 'PRODUCT',
        entityId: id,
        payload: { oldStatus: existing.status, newStatus: dto.status },
      });
    }

    return updated;
  }

  async softDelete(tenantId: string, id: string, currentUser?: AuthenticatedUser): Promise<Product> {
    await this.findById(tenantId, id);
    const deleted = await this.productRepository.softDelete(tenantId, id);

    await this.auditService.logAction({
      tenantId,
      userId: currentUser?.userId,
      action: 'PRODUCT_DELETED',
      entityType: 'PRODUCT',
      entityId: id,
    });

    return deleted;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
