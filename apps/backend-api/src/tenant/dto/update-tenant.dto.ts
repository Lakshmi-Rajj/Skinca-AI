import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { SubscriptionTier, TenantStatus } from '@platform/database-client';

export class UpdateTenantDto {
  @ApiProperty({ example: 'Acme Skincare Inc.', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ enum: TenantStatus, required: false })
  @IsEnum(TenantStatus)
  @IsOptional()
  status?: TenantStatus;

  @ApiProperty({ enum: SubscriptionTier, required: false })
  @IsEnum(SubscriptionTier)
  @IsOptional()
  subscriptionTier?: SubscriptionTier;
}
