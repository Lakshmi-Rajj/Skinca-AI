export type SubscriptionTier = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'ARCHIVED' | 'CANCELLED';

export interface TenantResponseContract {
  id: string;
  name: string;
  subdomain: string;
  subscriptionTier: SubscriptionTier;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TenantConfigContract {
  brandName?: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor: string;
  logoUrl?: string;
  widgetPosition: string;
  maxBudgetLimit?: number;
  customCss?: string;
  featureFlags: Record<string, boolean>;
  defaultLanguage: string;
  timeZone: string;
}
