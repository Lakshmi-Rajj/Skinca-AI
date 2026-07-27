import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ClaimRepository } from '@platform/database-client';
import { CreateClaimDto } from './dto/create-claim.dto';
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
export class ClaimService {
  private claimRepository = new ClaimRepository();

  constructor(private auditService: AuditService) {}

  async findAll(tenantId: string, options: { page?: number; limit?: number; search?: string }): Promise<any> {
    return this.claimRepository.findAll(tenantId, options);
  }

  async create(tenantId: string, dto: CreateClaimDto, currentUserId: string): Promise<any> {
    const slug = slugify(dto.name);
    const existing = await this.claimRepository.findBySlug(tenantId, slug);
    if (existing) {
      throw new ConflictException('A claim with this name already exists');
    }

    const claim = await this.claimRepository.create({
      tenant: { connect: { id: tenantId } },
      name: dto.name,
      slug,
      description: dto.description,
      icon: dto.icon,
      category: dto.category || 'BENEFIT',
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'CLAIM_CREATED',
      entityType: 'PRODUCT_CLAIM',
      entityId: claim.id,
      payload: { name: claim.name, slug: claim.slug },
    });

    return claim;
  }

  async delete(tenantId: string, id: string, currentUserId: string): Promise<{ message: string }> {
    const claim = await this.claimRepository.findById(tenantId, id);
    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    await this.claimRepository.delete(tenantId, id);

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'CLAIM_DELETED',
      entityType: 'PRODUCT_CLAIM',
      entityId: id,
    });

    return { message: 'Claim deleted successfully' };
  }
}
