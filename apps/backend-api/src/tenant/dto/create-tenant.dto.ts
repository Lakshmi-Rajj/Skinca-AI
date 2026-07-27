import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { SubscriptionTier } from '@platform/database-client';

export class CreateTenantDto {
  @ApiProperty({ example: 'Acme Skincare', description: 'Display name of tenant organization' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'acme-skincare', description: 'Unique sub-domain prefix identifier' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, { message: 'subdomain must contain only lowercase alphanumeric characters and hyphens' })
  subdomain!: string;

  @ApiProperty({ enum: SubscriptionTier, default: 'STARTER', required: false })
  @IsEnum(SubscriptionTier)
  @IsOptional()
  subscriptionTier?: SubscriptionTier;
}
