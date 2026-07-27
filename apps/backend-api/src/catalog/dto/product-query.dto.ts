import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@platform/database-client';

export class ProductQueryDto {
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

  @ApiProperty({ example: 'Hyaluronic', description: 'Search name, SKU, or brand', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ enum: ProductStatus, required: false })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ example: 'cat_cleanser_uuid_123', required: false })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: 'createdAt', enum: ['name', 'createdAt', 'price'], required: false })
  @IsEnum(['name', 'createdAt', 'price'])
  @IsOptional()
  sortBy?: 'name' | 'createdAt' | 'price' = 'createdAt';

  @ApiProperty({ example: 'desc', enum: ['asc', 'desc'], required: false })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
