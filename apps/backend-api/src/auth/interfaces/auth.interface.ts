export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

export interface UserIdentity {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: UserIdentity;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
  permissions: string[];
}
