export interface WidgetSessionResponseContract {
  sessionId: string;
  tenantId: string;
  createdAt: string;
  expiresAt: string;
  widgetVersion: string;
}

export interface WidgetPublicConfigContract {
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typography: string;
  borderRadius: string;
  buttonStyle: string;
  widgetTitle: string;
  welcomeMessage: string;
  supportedLanguages: string[];
}

export interface WidgetRecommendationRequestContract {
  sessionId: string;
  tenantId: string;
  skinType: string;
  skinConcerns?: string[];
  allergies?: string[];
  excludedIngredients?: string[];
}
