export interface AuthenticatedUser {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  permissions: string[];
  authProvider: string;
  firstName?: string;
  lastName?: string;
}

export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  role: string;
  permissions: string[];
  authProvider: string;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
}
