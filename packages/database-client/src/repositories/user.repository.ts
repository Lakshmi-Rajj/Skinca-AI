import { User, Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface IUserRepository {
  findAll(
    tenantId: string,
    options?: { page?: number; limit?: number; search?: string },
  ): Promise<{ items: User[]; total: number }>;
  findById(tenantId: string, id: string): Promise<User | null>;
  findByEmail(tenantId: string, email: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
  findByVerificationToken(token: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(tenantId: string, id: string, data: Prisma.UserUpdateInput): Promise<User>;
  softDelete(tenantId: string, id: string): Promise<User>;
}

export class UserRepository implements IUserRepository {
  async findAll(
    tenantId: string,
    options: { page?: number; limit?: number; search?: string } = {},
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      tenantId,
      deletedAt: null,
      ...(options.search
        ? {
            OR: [
              { email: { contains: options.search, mode: 'insensitive' } },
              { firstName: { contains: options.search, mode: 'insensitive' } },
              { lastName: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { role: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  }

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

  async findByResetToken(token: string) {
    return prisma.user.findFirst({
      where: { resetPasswordToken: token, deletedAt: null },
      include: { role: true },
    });
  }

  async findByVerificationToken(token: string) {
    return prisma.user.findFirst({
      where: { verificationToken: token, deletedAt: null },
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
