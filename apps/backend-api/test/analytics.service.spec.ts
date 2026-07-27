import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../src/analytics/analytics.service';
import {
  CustomerRepository,
  ProductRepository,
  AssessmentRepository,
  RecommendationHistoryRepository,
  RoutineRepository,
  AuditLogRepository,
  TenantRepository,
} from '@platform/database-client';

describe('AnalyticsService Unit Tests', () => {
  let analyticsService: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        CustomerRepository,
        ProductRepository,
        AssessmentRepository,
        RecommendationHistoryRepository,
        RoutineRepository,
        AuditLogRepository,
        TenantRepository,
      ],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  it('AnalyticsService should compile and return dashboard KPIs', async () => {
    const result = await analyticsService.getDashboardKpis('t1', {});
    expect(result).toBeDefined();
    expect(result.kpis.totalCustomers).toBeGreaterThan(0);
    expect(result.topSkinConcerns).toHaveLength(4);
  });

  it('AnalyticsService should return AI analytics metrics', async () => {
    const aiStats = await analyticsService.getAIAnalytics('t1', {});
    expect(aiStats).toBeDefined();
    expect(aiStats.totalExplanationsGenerated).toBe(4190);
    expect(aiStats.averageLatencyMs).toBeLessThan(200);
  });
});
