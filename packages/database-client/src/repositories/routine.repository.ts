import { PrismaClient, PersonalizedRoutine } from '@prisma/client';
import { prisma as defaultPrisma } from '../client';

export class RoutineRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || defaultPrisma;
  }

  async create(data: {
    tenantId: string;
    customerId: string;
    routineType?: string;
    engineVersion?: string;
    morningSteps: any;
    eveningSteps: any;
    warnings?: string[];
    explanation?: any;
  }): Promise<PersonalizedRoutine> {
    return this.prisma.personalizedRoutine.create({ data });
  }

  async findById(tenantId: string, id: string): Promise<PersonalizedRoutine | null> {
    return this.prisma.personalizedRoutine.findFirst({
      where: { id, tenantId },
    });
  }

  async getCustomerRoutines(tenantId: string, customerId: string): Promise<PersonalizedRoutine[]> {
    return this.prisma.personalizedRoutine.findMany({
      where: { customerId, tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
