import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum SkinTypeEnum {
  DRY = 'DRY',
  OILY = 'OILY',
  COMBINATION = 'COMBINATION',
  SENSITIVE = 'SENSITIVE',
  NORMAL = 'NORMAL',
}

export class SkinProfileDto {
  @ApiProperty({ enum: SkinTypeEnum, example: SkinTypeEnum.COMBINATION })
  @IsEnum(SkinTypeEnum)
  @IsNotEmpty()
  skinType!: SkinTypeEnum;

  @ApiPropertyOptional({ example: ['acne', 'hyperpigmentation'] })
  @IsArray()
  @IsOptional()
  concerns?: string[];

  @ApiPropertyOptional({ example: 'HIGH' })
  @IsString()
  @IsOptional()
  sensitivity?: string;

  @ApiPropertyOptional({ example: 'MODERATE' })
  @IsString()
  @IsOptional()
  hydrationLevel?: string;

  @ApiPropertyOptional({ example: 'MILD' })
  @IsString()
  @IsOptional()
  acneSeverity?: string;

  @ApiPropertyOptional({ example: 'MODERATE' })
  @IsString()
  @IsOptional()
  pigmentationLevel?: string;

  @ApiPropertyOptional({ example: 'NONE' })
  @IsString()
  @IsOptional()
  wrinkleLevel?: string;
}
