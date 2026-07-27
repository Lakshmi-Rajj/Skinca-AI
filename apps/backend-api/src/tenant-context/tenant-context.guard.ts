import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';

@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(private tenantContextService: TenantContextService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    let tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId && request.user && request.user.tenantId) {
      tenantId = request.user.tenantId;
    }

    if (!tenantId) {
      const host = request.headers.host || '';
      const parts = host.split('.');
      if (parts.length >= 3) {
        tenantId = parts[0]; // Subdomain fallback
      }
    }

    if (tenantId) {
      request.tenantId = tenantId;
      this.tenantContextService.setTenantId(tenantId);
    }

    return true;
  }
}
