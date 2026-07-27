import { AuditLog } from '@prisma/client';
import { prisma } from '../client';

export interface CreateAuditLogDto {
  tenantId?: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  payload?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface IAuditLogRepository {
  create(data: CreateAuditLogDto): Promise<AuditLog>;
  findByTenant(tenantId: string, limit?: number): Promise<AuditLog[]>;
}

export class AuditLogRepository implements IAuditLogRepository {
  async create(data: CreateAuditLogDto) {
    return prisma.auditLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        payload: data.payload || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        tenant: data.tenantId ? { connect: { id: data.tenantId } } : undefined,
        user: data.userId ? { connect: { id: data.userId } } : undefined,
      },
    });
  }

  async findByTenant(tenantId: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
