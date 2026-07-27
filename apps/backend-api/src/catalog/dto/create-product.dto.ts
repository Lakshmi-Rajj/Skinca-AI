import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ProductImageDto {
  @ApiProperty({ example: 'https://cdn.platform.com/products/cleanser.png' })
  @IsString()
  @IsNotEmpty()
  url!: string;

  @ApiPropertyOptional({ example: 'Gentle Cleanser bottle front view' })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export enum ProductStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateProductDto {
  @ApiProperty({ example: 'Gentle Hydrating Cleanser' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'cat_uuid_123', description: 'Category UUID' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ApiPropertyOptional({ example: 'brand_uuid_123', description: 'Brand UUID' })
  @IsUUID()
  @IsOptional()
  brandId?: string;

  @ApiPropertyOptional({ example: 'Aesop' })
  @IsString()
  @IsOptional()
  brandName?: string;

  @ApiProperty({ example: 'AESOP-CLEANSER-001' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiPropertyOptional({ example: '9319944001234' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ example: 'Hydrating daily facial cleanser' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'A gentle facial cleanser formulated with Botanical Extracts...' })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiPropertyOptional({ example: 'Apply to wet skin, massage gently, and rinse thoroughly.' })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({ example: 'CLEANSER' })
  @IsString()
  @IsOptional()
  productType?: string;

  @ApiPropertyOptional({ enum: ProductStatusEnum, default: ProductStatusEnum.DRAFT })
  @IsEnum(ProductStatusEnum)
  @IsOptional()
  status?: ProductStatusEnum;

  @ApiPropertyOptional({ example: 39.0 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: ['cleanser', 'hydrating', 'sensitive'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: ['claim_uuid_1', 'claim_uuid_2'] })
  @IsArray()
  @IsOptional()
  claimIds?: string[];

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @IsOptional()
  images?: ProductImageDto[];

  @ApiPropertyOptional({ example: 'Gentle Hydrating Cleanser | Aesop' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'Shop Aesop Gentle Hydrating Cleanser for soft, clean skin.' })
  @IsString()
  @IsOptional()
  metaDescription?: string;
}
