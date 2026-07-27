import { PrismaClient, Customer } from '@prisma/client';
import { prisma as defaultPrisma } from '../client';

export class CustomerRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || defaultPrisma;
  }

  async create(data: {
    tenantId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  async findById(tenantId: string, id: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: { id, tenantId },
      include: {
        skinProfiles: { where: { isCurrent: true } },
      },
    });
  }

  async findAll(tenantId: string, query?: { page?: number; limit?: number; search?: string }): Promise<{ items: Customer[]; total: number }> {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (query?.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { items, total };
  }

  async update(tenantId: string, id: string, data: Partial<Customer>): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string): Promise<Customer> {
    return this.prisma.customer.delete({ where: { id } });
  }
}
