import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository, RoleRepository } from '@platform/database-client';
import { PasswordHasher } from '../common/security/password-hasher';
import { AuthenticatedUser, JwtPayload } from './interfaces/auth.interface';

export interface LoginDto {
  tenantId: string;
  email: string;
  password: string;
}

export interface AuthTokenResult {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  private userRepository = new UserRepository();
  private roleRepository = new RoleRepository();

  constructor(private jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<AuthTokenResult> {
    const user = await this.userRepository.findByEmail(dto.tenantId, dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials or account disabled');
    }

    if (user.passwordHash) {
      const isPasswordValid = await PasswordHasher.compare(dto.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const role = await this.roleRepository.findById(user.roleId);
    const permissions = role?.permissions.map((p) => p.permission.name) || [];

    const authenticatedUser: AuthenticatedUser = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: role?.name || 'MEMBER',
      permissions,
      authProvider: user.authProvider,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: role?.name || 'MEMBER',
      permissions,
      authProvider: user.authProvider,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      expiresIn: 86400,
      tokenType: 'Bearer',
      user: authenticatedUser,
    };
  }
}
