import { Injectable } from '@nestjs/common';
import { AuditLogRepository, CreateAuditLogDto } from '@platform/database-client';
import { logger } from '@platform/logger';

export type LogAuditEventInput = CreateAuditLogDto;

@Injectable()
export class AuditService {
  private auditLogRepository = new AuditLogRepository();

  async logAction(input: LogAuditEventInput): Promise<void> {
    try {
      await this.auditLogRepository.create(input);

      logger.info({
        tenantId: input.tenantId,
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
      }, `Audit Event Logged: ${input.action} on ${input.entityType}`);
    } catch (error: any) {
      logger.error({
        error: error.message,
        input,
      }, 'Failed to persist audit log entry');
    }
  }
}
