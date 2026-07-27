import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository, RoleRepository } from '@platform/database-client';
import { PasswordHasher } from './utils/password-hasher.util';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtPayload, AuthTokenResponse, UserIdentity } from './interfaces/auth.interface';
import { AuditService } from '../audit/audit.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private userRepository = new UserRepository();
  private roleRepository = new RoleRepository();

  constructor(
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async login(dto: AuthCredentialsDto): Promise<AuthTokenResponse> {
    const user = await this.userRepository.findByEmail(dto.tenantId, dto.email);
    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Local authentication is disabled for this user');
    }

    const isValidPassword = await PasswordHasher.verify(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const role = await this.roleRepository.findById(user.roleId);
    const permissions = role
      ? role.permissions.map((rp) => rp.permission.name)
      : [];

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roleId: user.roleId,
      roleName: role ? role.name : 'USER',
      permissions,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign({ sub: user.id, tenantId: user.tenantId }, { expiresIn: '7d' });

    const refreshTokenHash = await PasswordHasher.hash(refreshToken);
    await this.userRepository.update(user.tenantId, user.id, {
      refreshTokenHash,
      lastLoginAt: new Date(),
    });

    await this.auditService.logAction({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'USER_LOGGED_IN',
      entityType: 'USER',
      entityId: user.id,
      payload: { email: user.email, authProvider: user.authProvider },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: role ? role.name : 'USER',
        permissions,
      },
    };
  }

  async logout(tenantId: string, userId: string): Promise<{ message: string }> {
    await this.userRepository.update(tenantId, userId, {
      refreshTokenHash: null,
    });

    await this.auditService.logAction({
      tenantId,
      userId,
      action: 'USER_LOGGED_OUT',
      entityType: 'USER',
      entityId: userId,
    });

    return { message: 'Logged out successfully' };
  }

  async refreshToken(dto: RefreshTokenDto): Promise<AuthTokenResponse> {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findById(payload.tenantId, payload.sub);
    if (!user || !user.isActive || !user.refreshTokenHash || user.deletedAt) {
      throw new UnauthorizedException('Session revoked or invalid');
    }

    const isMatch = await PasswordHasher.verify(dto.refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const role = await this.roleRepository.findById(user.roleId);
    const permissions = role ? role.permissions.map((rp) => rp.permission.name) : [];

    const newAccessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        tenantId: user.tenantId,
        roleId: user.roleId,
        roleName: role ? role.name : 'USER',
        permissions,
      },
      { expiresIn: '1h' },
    );

    const newRefreshToken = this.jwtService.sign(
      { sub: user.id, tenantId: user.tenantId },
      { expiresIn: '7d' },
    );

    const newRefreshTokenHash = await PasswordHasher.hash(newRefreshToken);
    await this.userRepository.update(user.tenantId, user.id, {
      refreshTokenHash: newRefreshTokenHash,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: role ? role.name : 'USER',
        permissions,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
    const user = await this.userRepository.findByEmail(dto.tenantId, dto.email);
    if (!user || !user.isActive || user.deletedAt) {
      return { message: 'If account exists, password reset instructions have been sent.' };
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.userRepository.update(dto.tenantId, user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: expiresAt,
    });

    await this.auditService.logAction({
      tenantId: dto.tenantId,
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      entityType: 'USER',
      entityId: user.id,
    });

    return {
      message: 'If account exists, password reset instructions have been sent.',
      resetToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByResetToken(dto.token);
    if (!user || !user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const newPasswordHash = await PasswordHasher.hash(dto.newPassword);
    await this.userRepository.update(user.tenantId, user.id, {
      passwordHash: newPasswordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      refreshTokenHash: null, // Revoke active sessions
    });

    await this.auditService.logAction({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'USER',
      entityId: user.id,
    });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByVerificationToken(dto.token);
    if (!user) {
      throw new BadRequestException('Invalid email verification token');
    }

    await this.userRepository.update(user.tenantId, user.id, {
      isEmailVerified: true,
      verificationToken: null,
    });

    return { message: 'Email address verified successfully' };
  }

  async getProfile(tenantId: string, userId: string): Promise<UserIdentity> {
    const user = await this.userRepository.findById(tenantId, userId);
    if (!user || !user.isActive || user.deletedAt) {
      throw new NotFoundException('User profile not found');
    }

    const role = await this.roleRepository.findById(user.roleId);
    const permissions = role ? role.permissions.map((rp) => rp.permission.name) : [];

    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: role ? role.name : 'USER',
      permissions,
    };
  }
}
