export interface DashboardMetricsContract {
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

export interface AnalyticsSummaryContract {
  recommendationVolume: number;
  topRecommendedProducts: { name: string; category: string; count: number }[];
  commonSkinConcerns: { concern: string; percentage: number }[];
  popularIngredients: { inciName: string; count: number }[];
  activityTimeline: { date: string; recommendations: number }[];
}
