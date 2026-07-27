import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientQueryDto {
  @ApiProperty({ example: 1, default: 1, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 20, default: 20, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ example: 'Hyaluronic', description: 'Search by INCI name, display name, or alias', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ example: 'HUMECTANT', description: 'Filter by function (HUMECTANT, EMOLLIENT, EXFOLIANT, etc.)', required: false })
  @IsString()
  @IsOptional()
  functionName?: string;

  @ApiProperty({ example: 'DRY', description: 'Filter by skin type compatibility (DRY, OILY, SENSITIVE, etc.)', required: false })
  @IsString()
  @IsOptional()
  skinType?: string;

  @ApiProperty({ example: 'ACNE', description: 'Filter by skin concern (ACNE, HYPERPIGMENTATION, REDNESS, etc.)', required: false })
  @IsString()
  @IsOptional()
  skinConcern?: string;
}
