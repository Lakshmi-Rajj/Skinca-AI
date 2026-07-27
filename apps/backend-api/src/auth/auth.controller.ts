import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, LoginDto } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentTenant } from './decorators/current-tenant.decorator';
import { Permissions } from './decorators/permissions.decorator';
import { AuthenticatedUser } from './interfaces/auth.interface';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class LoginRequestDto implements LoginDto {
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user credentials and issue JWT access token' })
  @ApiResponse({ status: 200, description: 'JWT Access token issued successfully' })
  @ApiResponse({ status: 401, description: 'Invalid user credentials' })
  async login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Retrieve currently authenticated user identity and context' })
  @ApiResponse({ status: 200, description: 'Current user profile details' })
  @ApiResponse({ status: 401, description: 'Unauthenticated' })
  async getProfile(@CurrentUser() user: AuthenticatedUser, @CurrentTenant() tenantId: string) {
    return {
      user,
      resolvedTenantId: tenantId,
    };
  }

  @Get('tenant-config-test')
  @ApiBearerAuth('bearer-auth')
  @Permissions('tenant:config:read')
  @ApiOperation({ summary: 'Protected test endpoint requiring tenant:config:read permission' })
  @ApiResponse({ status: 200, description: 'Permission check authorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Missing required permission' })
  async testTenantConfigPermission(@CurrentUser() user: AuthenticatedUser) {
    return {
      authorized: true,
      message: 'User is authorized to read tenant configuration',
      permission: 'tenant:config:read',
      userEmail: user.email,
    };
  }
}
