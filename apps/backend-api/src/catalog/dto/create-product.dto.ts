import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@platform/database-client';

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://cdn.acmeglow.com/products/hydrating-serum-1.jpg' })
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @ApiProperty({ example: 'Front bottle view of Hydrating Serum', required: false })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiProperty({ example: 0, default: 0, required: false })
  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({ example: true, default: false, required: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Hydrating Hyaluronic Serum 30ml', description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'cat_cleanser_uuid_123', description: 'Associated category UUID' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ example: 'ACME-SERUM-001', description: 'Unique Stock Keeping Unit (SKU) per tenant' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku!: string;

  @ApiProperty({ example: 'Acme Glow', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @ApiProperty({ example: 'Deep hydration daily facial serum with 2% Hyaluronic Acid', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({ example: 'Formulated with low and high molecular weight hyaluronic acid to penetrate multiple skin layers...', required: false })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiProperty({ example: 'SERUM', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  productType?: string;

  @ApiProperty({ enum: ProductStatus, default: 'DRAFT', required: false })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ example: 48.00, required: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'USD', default: 'USD', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({ type: [CreateProductImageDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  @IsOptional()
  images?: CreateProductImageDto[];
}
