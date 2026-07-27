import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export class CreateTenantDto {
  @ApiProperty({ example: 'Acme Glow Beauty', description: 'Tenant company or store name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'acmeglow', description: 'Unique subdomain prefix' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'Subdomain must contain lowercase alphanumeric characters and hyphens' })
  subdomain!: string;

  @ApiPropertyOptional({ enum: SubscriptionTier, default: SubscriptionTier.STARTER })
  @IsEnum(SubscriptionTier)
  @IsOptional()
  subscriptionTier?: SubscriptionTier;

  @ApiProperty({ example: 'owner@acmeglow.com', description: 'Owner account email address' })
  @IsEmail()
  @IsNotEmpty()
  ownerEmail!: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Owner initial password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  ownerPassword!: string;

  @ApiProperty({ example: 'Alice', description: 'Owner first name' })
  @IsString()
  @IsNotEmpty()
  ownerFirstName!: string;

  @ApiProperty({ example: 'Smith', description: 'Owner last name' })
  @IsString()
  @IsNotEmpty()
  ownerLastName!: string;
}
