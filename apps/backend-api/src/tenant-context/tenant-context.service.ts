import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private tenantId: string | null = null;

  setTenantId(tenantId: string): void {
    this.tenantId = tenantId;
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  hasTenantContext(): boolean {
    return this.tenantId !== null && this.tenantId !== undefined && this.tenantId.length > 0;
  }
}
