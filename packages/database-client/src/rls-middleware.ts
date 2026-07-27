import { prisma } from './client';

export async function withTenantContext<T>(
  tenantId: string,
  fn: (tx: typeof prisma) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx: unknown) => {
    const prismaTx = tx as typeof prisma;
    await (prismaTx as any).$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${tenantId}';`);
    return await fn(prismaTx);
  });
}
