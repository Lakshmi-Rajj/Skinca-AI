import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@platform/database-client';
import { CreateProductImageDto } from './create-product.dto';

export class UpdateProductDto {
  @ApiProperty({ example: 'Hydrating Hyaluronic Serum 50ml', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'cat_cleanser_uuid_123', required: false })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: 'ACME-SERUM-001', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  sku?: string;

  @ApiProperty({ example: 'Acme Glow', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @ApiProperty({ example: 'Updated short description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  shortDescription?: string;

  @ApiProperty({ example: 'Updated long description', required: false })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiProperty({ example: 'SERUM', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  productType?: string;

  @ApiProperty({ enum: ProductStatus, required: false })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ example: 52.00, required: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'USD', required: false })
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
