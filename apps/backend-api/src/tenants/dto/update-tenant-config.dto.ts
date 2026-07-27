import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsHexColor, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateTenantConfigDto {
  @ApiPropertyOptional({ example: 'Acme Glow Skincare', description: 'Storefront display brand name' })
  @IsString()
  @IsOptional()
  brandName?: string;

  @ApiPropertyOptional({ example: '#1A1A1A', description: 'Primary brand theme color hex' })
  @IsHexColor()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#E5E5E5', description: 'Accent brand theme color hex' })
  @IsHexColor()
  @IsOptional()
  accentColor?: string;

  @ApiPropertyOptional({ example: 'https://cdn.acmeglow.com/logo.png', description: 'Logo image URL' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'BOTTOM_RIGHT', description: 'Storefront widget floating position' })
  @IsString()
  @IsOptional()
  widgetPosition?: string;

  @ApiPropertyOptional({ example: 'en', description: 'Default widget language' })
  @IsString()
  @IsOptional()
  defaultLanguage?: string;

  @ApiPropertyOptional({ example: 'America/New_York', description: 'Tenant timezone' })
  @IsString()
  @IsOptional()
  timeZone?: string;

  @ApiPropertyOptional({ example: { enableAIExplanations: true }, description: 'Feature toggle flags' })
  @IsObject()
  @IsOptional()
  featureFlags?: Record<string, boolean>;
}
