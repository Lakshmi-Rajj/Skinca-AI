import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class WidgetRecommendationDto {
  @ApiProperty({ example: 'w_sess_uuid_123', description: 'Active Widget Session ID' })
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @ApiProperty({ example: 'tenant_uuid_123', description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: 'DRY', description: 'User skin type (DRY, OILY, COMBINATION, SENSITIVE, NORMAL)' })
  @IsString()
  @IsNotEmpty()
  skinType!: string;

  @ApiProperty({ example: ['DEHYDRATION', 'BARRIER_REPAIR'], required: false })
  @IsArray()
  @IsOptional()
  skinConcerns?: string[];

  @ApiProperty({ example: ['Salicylic Acid'], required: false })
  @IsArray()
  @IsOptional()
  allergies?: string[];

  @ApiProperty({ example: ['Fragrance'], required: false })
  @IsArray()
  @IsOptional()
  excludedIngredients?: string[];
}
