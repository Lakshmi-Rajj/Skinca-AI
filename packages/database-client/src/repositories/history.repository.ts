import { PrismaClient, RecommendationHistory } from '@prisma/client';
import { prisma as defaultPrisma } from '../client';

export class RecommendationHistoryRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || defaultPrisma;
  }

  async create(data: {
    customerId: string;
    recommendationId: string;
    engineVersion: string;
    confidenceScore: number;
    accepted?: boolean;
    feedback?: string;
    products: any;
  }): Promise<RecommendationHistory> {
    return this.prisma.recommendationHistory.create({ data });
  }

  async getCustomerHistory(customerId: string): Promise<RecommendationHistory[]> {
    return this.prisma.recommendationHistory.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
