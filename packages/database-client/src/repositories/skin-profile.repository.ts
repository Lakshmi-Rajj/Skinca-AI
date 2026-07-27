import { PrismaClient, SkinProfile } from '@prisma/client';
import { prisma as defaultPrisma } from '../client';

export class SkinProfileRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || defaultPrisma;
  }

  async createNewVersion(data: {
    customerId: string;
    skinType: string;
    concerns: string[];
    sensitivity?: string;
    hydrationLevel?: string;
    acneSeverity?: string;
    pigmentationLevel?: string;
    wrinkleLevel?: string;
  }): Promise<SkinProfile> {
    await this.prisma.skinProfile.updateMany({
      where: { customerId: data.customerId, isCurrent: true },
      data: { isCurrent: false },
    });

    const count = await this.prisma.skinProfile.count({
      where: { customerId: data.customerId },
    });

    return this.prisma.skinProfile.create({
      data: {
        ...data,
        version: count + 1,
        isCurrent: true,
      },
    });
  }

  async getCurrentProfile(customerId: string): Promise<SkinProfile | null> {
    return this.prisma.skinProfile.findFirst({
      where: { customerId, isCurrent: true },
    });
  }

  async getProfileHistory(customerId: string): Promise<SkinProfile[]> {
    return this.prisma.skinProfile.findMany({
      where: { customerId },
      orderBy: { version: 'desc' },
    });
  }
}
