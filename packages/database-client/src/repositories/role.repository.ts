import { Role, Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;
  findByName(tenantId: string | null, name: string): Promise<Role | null>;
  create(data: Prisma.RoleCreateInput): Promise<Role>;
}

export class RoleRepository implements IRoleRepository {
  async findById(id: string) {
    return prisma.role.findFirst({
      where: { id, deletedAt: null },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async findByName(tenantId: string | null, name: string) {
    return prisma.role.findFirst({
      where: { name, tenantId, deletedAt: null },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async create(data: Prisma.RoleCreateInput) {
    return prisma.role.create({
      data,
    });
  }
}
