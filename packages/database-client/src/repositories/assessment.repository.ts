import { PrismaClient, AssessmentHistory } from '@prisma/client';
import { prisma as defaultPrisma } from '../client';

export class AssessmentRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || defaultPrisma;
  }

  async create(data: {
    customerId: string;
    questionnaireAnswers: any;
    calculatedProfile: any;
  }): Promise<AssessmentHistory> {
    return this.prisma.assessmentHistory.create({ data });
  }

  async findById(id: string): Promise<AssessmentHistory | null> {
    return this.prisma.assessmentHistory.findUnique({ where: { id } });
  }

  async getCustomerAssessmentHistory(customerId: string): Promise<AssessmentHistory[]> {
    return this.prisma.assessmentHistory.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
