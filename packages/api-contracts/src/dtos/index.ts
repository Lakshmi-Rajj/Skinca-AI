export interface TenantConfigResponse {
  tenantId: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  widgetPosition: string;
  currency: string;
}

export interface RecommendationRequestPayload {
  submissionId: string;
  sessionToken: string;
}
