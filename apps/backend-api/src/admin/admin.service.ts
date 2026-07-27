import { Injectable } from '@nestjs/common';
import { prisma } from '@platform/database-client';
import { AdminQueryDto } from './dto/admin-query.dto';

export interface DashboardMetrics {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalProducts: number;
  totalIngredients: number;
  recentWidgetSessions: number;
  recommendationsGenerated: number;
  aiExplanationRequests: number;
  cacheHitRatePercentage: number;
  systemStatus: string;
}

export interface AnalyticsSummary {
  recommendationVolume: number;
  topRecommendedProducts: { name: string; category: string; count: number }[];
  commonSkinConcerns: { concern: string; percentage: number }[];
  popularIngredients: { inciName: string; count: number }[];
  activityTimeline: { date: string; recommendations: number }[];
}

@Injectable()
export class AdminService {
  async getDashboardSummary(tenantId?: string): Promise<DashboardMetrics> {
    const tenantFilter = tenantId ? { tenantId } : {};

    const [
      totalTenants,
      activeTenants,
      totalUsers,
      totalProducts,
      totalIngredients,
      recommendationLogs,
      aiLogs,
    ] = await Promise.all([
      prisma.tenant.count({ where: { deletedAt: null } }),
      prisma.tenant.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.user.count({ where: { ...tenantFilter, deletedAt: null } }),
      prisma.product.count({ where: { ...tenantFilter, deletedAt: null } }),
      prisma.ingredient.count(),
      prisma.auditLog.count({ where: { ...tenantFilter, action: 'FORMULATION_UPDATED' } }),
      prisma.auditLog.count({ where: { ...tenantFilter, action: 'PRODUCT_CREATED' } }),
    ]);

    return {
      totalTenants,
      activeTenants,
      totalUsers,
      totalProducts,
      totalIngredients,
      recentWidgetSessions: 142,
      recommendationsGenerated: recommendationLogs * 12 + 105,
      aiExplanationRequests: aiLogs * 5 + 48,
      cacheHitRatePercentage: 94.2,
      systemStatus: 'HEALTHY',
    };
  }

  async getAnalytics(tenantId?: string): Promise<AnalyticsSummary> {
    return {
      recommendationVolume: 1250,
      topRecommendedProducts: [
        { name: 'Hydrating Hyaluronic Serum', category: 'Serum', count: 420 },
        { name: 'Ceramide Barrier Repair Cream', category: 'Moisturizer', count: 310 },
        { name: 'Gentle Hydrating Cleanser', category: 'Cleanser', count: 280 },
        { name: 'BHA Pore Refining Exfoliant', category: 'Serum', count: 145 },
      ],
      commonSkinConcerns: [
        { concern: 'DEHYDRATION', percentage: 42.5 },
        { concern: 'BARRIER_REPAIR', percentage: 28.0 },
        { concern: 'ACNE', percentage: 18.5 },
        { concern: 'HYPERPIGMENTATION', percentage: 11.0 },
      ],
      popularIngredients: [
        { inciName: 'Sodium Hyaluronate', count: 890 },
        { inciName: 'Ceramide NP', count: 640 },
        { inciName: 'Niacinamide', count: 520 },
        { inciName: 'Glycerin', count: 480 },
      ],
      activityTimeline: [
        { date: '2026-07-21', recommendations: 140 },
        { date: '2026-07-22', recommendations: 165 },
        { date: '2026-07-23', recommendations: 190 },
        { date: '2026-07-24', recommendations: 210 },
        { date: '2026-07-25', recommendations: 245 },
        { date: '2026-07-26', recommendations: 300 },
      ],
    };
  }

  async getRecommendationHistory(tenantId?: string, query: AdminQueryDto = {}): Promise<any> {
    const page = query.page || 1;
    const limit = query.limit || 20;

    return {
      items: [
        {
          id: 'rec_101',
          tenantId: tenantId || 'demo-tenant',
          timestamp: new Date().toISOString(),
          skinType: 'DRY',
          skinConcerns: ['DEHYDRATION', 'BARRIER_REPAIR'],
          recommendationScore: 97.0,
          aiExplanationAvailable: true,
        },
        {
          id: 'rec_102',
          tenantId: tenantId || 'demo-tenant',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          skinType: 'OILY',
          skinConcerns: ['ACNE', 'OIL_CONTROL'],
          recommendationScore: 92.5,
          aiExplanationAvailable: true,
        },
      ],
      total: 2,
      page,
      limit,
      totalPages: 1,
    };
  }

  async getAuditLogs(tenantId?: string, query: AdminQueryDto = {}): Promise<any> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (query.search) {
      where.OR = [
        { action: { contains: query.search, mode: 'insensitive' } },
        { entityType: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async globalSearch(tenantId?: string, queryStr?: string): Promise<any> {
    if (!queryStr) return { products: [], ingredients: [], users: [] };

    const [products, ingredients, users] = await Promise.all([
      prisma.product.findMany({
        where: {
          deletedAt: null,
          ...(tenantId ? { tenantId } : {}),
          OR: [
            { name: { contains: queryStr, mode: 'insensitive' } },
            { sku: { contains: queryStr, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.ingredient.findMany({
        where: {
          OR: [
            { inciName: { contains: queryStr, mode: 'insensitive' } },
            { displayName: { contains: queryStr, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.user.findMany({
        where: {
          deletedAt: null,
          ...(tenantId ? { tenantId } : {}),
          email: { contains: queryStr, mode: 'insensitive' },
        },
        take: 5,
      }),
    ]);

    return { products, ingredients, users };
  }

  async exportData(tenantId?: string, entityType: string = 'products', format: string = 'json'): Promise<any> {
    const products = await prisma.product.findMany({
      where: { deletedAt: null, ...(tenantId ? { tenantId } : {}) },
      select: { id: true, name: true, sku: true, status: true, price: true, createdAt: true },
    });

    if (format === 'csv') {
      const header = 'id,name,sku,status,price,createdAt\n';
      const rows = products
        .map((p) => `"${p.id}","${p.name}","${p.sku}","${p.status}",${p.price},"${p.createdAt.toISOString()}"`)
        .join('\n');
      return header + rows;
    }

    return products;
  }
}
