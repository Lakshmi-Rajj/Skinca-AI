import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BrandRepository } from '@platform/database-client';
import { CreateBrandDto } from './dto/create-brand.dto';
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
export class BrandService {
  private brandRepository = new BrandRepository();

  constructor(private auditService: AuditService) {}

  async findAll(tenantId: string, options: { page?: number; limit?: number; search?: string }): Promise<any> {
    return this.brandRepository.findAll(tenantId, options);
  }

  async findById(tenantId: string, id: string): Promise<any> {
    const brand = await this.brandRepository.findById(tenantId, id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async create(tenantId: string, dto: CreateBrandDto, currentUserId: string): Promise<any> {
    const slug = slugify(dto.name);
    const existing = await this.brandRepository.findBySlug(tenantId, slug);
    if (existing) {
      throw new ConflictException('A brand with this name already exists');
    }

    const brand = await this.brandRepository.create({
      tenant: { connect: { id: tenantId } },
      name: dto.name,
      slug,
      logoUrl: dto.logoUrl,
      website: dto.website,
      country: dto.country,
      manufacturer: dto.manufacturer,
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'BRAND_CREATED',
      entityType: 'BRAND',
      entityId: brand.id,
      payload: { name: brand.name, slug: brand.slug },
    });

    return brand;
  }

  async delete(tenantId: string, id: string, currentUserId: string): Promise<{ message: string }> {
    const brand = await this.brandRepository.findById(tenantId, id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.brandRepository.softDelete(tenantId, id);

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'BRAND_DELETED',
      entityType: 'BRAND',
      entityId: id,
    });

    return { message: 'Brand archived successfully' };
  }
}
