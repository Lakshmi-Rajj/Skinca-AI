import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateTenantConfigDto {
  @ApiProperty({ example: 'Acme Glow', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  brandName?: string;

  @ApiProperty({ example: '#1A202C', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'primaryColor must be a valid 6-digit hex color string' })
  primaryColor?: string;

  @ApiProperty({ example: '#319795', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'accentColor must be a valid 6-digit hex color string' })
  accentColor?: string;

  @ApiProperty({ example: 'https://cdn.acmeglow.com/logo.png', required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ example: 'BOTTOM_RIGHT', required: false })
  @IsString()
  @IsOptional()
  widgetPosition?: string;

  @ApiProperty({ example: { enableAiAssistant: true, enableRoutineTracker: true }, required: false })
  @IsObject()
  @IsOptional()
  featureFlags?: Record<string, any>;

  @ApiProperty({ example: 'en', required: false })
  @IsString()
  @IsOptional()
  defaultLanguage?: string;

  @ApiProperty({ example: 'UTC', required: false })
  @IsString()
  @IsOptional()
  timeZone?: string;
}
