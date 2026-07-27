import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', '');
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL', '');
  }

  get auth0Domain(): string {
    return this.configService.get<string>('AUTH0_DOMAIN', '');
  }

  get auth0Audience(): string {
    return this.configService.get<string>('AUTH0_AUDIENCE', '');
  }

  get widgetJwtPublicKey(): string {
    return this.configService.get<string>('WIDGET_JWT_PUBLIC_KEY', '');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
