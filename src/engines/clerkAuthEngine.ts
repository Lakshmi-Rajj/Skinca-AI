// ============================================================
// CLERK AUTHENTICATION & USER MANAGEMENT ENGINE
// Integration for @clerk/clerk-react with OAuth & Email Sign-In
// ============================================================

export const CLERK_PUBLISHABLE_KEY =
  (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_live_Y2xlcmsuc2tpbmNhLWFpLnZlcmNlbC5hcHAk';


export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  imageUrl?: string;
  provider: 'google' | 'email' | 'guest';
}

/**
 * Normalizes a Clerk user object or guest payload into standard AuthUser profile
 */
export function normalizeClerkUser(user: any): AuthUser {
  if (!user) {
    return {
      id: 'guest_user',
      email: 'guest@skinca.ai',
      fullName: 'Skinca Guest User',
      provider: 'guest',
    };
  }

  return {
    id: user.id || 'user_' + Math.random().toString(36).substring(2, 9),
    email: user.primaryEmailAddress?.emailAddress || user.email || 'user@skinca.ai',
    fullName: user.fullName || user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Skinca Member',
    imageUrl: user.imageUrl || user.avatarUrl,
    provider: user.externalAccounts?.[0]?.provider === 'oauth_google' ? 'google' : 'email',
  };
}
