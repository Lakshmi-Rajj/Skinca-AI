import { User, Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface IUserRepository {
  findById(tenantId: string, id: string): Promise<User | null>;
  findByEmail(tenantId: string, email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(tenantId: string, id: string, data: Prisma.UserUpdateInput): Promise<User>;
  softDelete(tenantId: string, id: string): Promise<User>;
}

export class UserRepository implements IUserRepository {
  async findById(tenantId: string, id: string) {
    return prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { role: true },
    });
  }

  async findByEmail(tenantId: string, email: string) {
    return prisma.user.findFirst({
      where: { email, tenantId, deletedAt: null },
      include: { role: true },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async update(tenantId: string, id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id, tenantId },
      data,
    });
  }

  async softDelete(tenantId: string, id: string) {
    return prisma.user.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });
  }
}
