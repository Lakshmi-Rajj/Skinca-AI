import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum SkinTypeEnum {
  DRY = 'DRY',
  OILY = 'OILY',
  COMBINATION = 'COMBINATION',
  SENSITIVE = 'SENSITIVE',
  NORMAL = 'NORMAL',
}

export class RecommendationRequestDto {
  @ApiProperty({ enum: SkinTypeEnum, example: SkinTypeEnum.COMBINATION })
  @IsEnum(SkinTypeEnum)
  @IsNotEmpty()
  skinType!: SkinTypeEnum;

  @ApiPropertyOptional({ example: ['acne', 'hyperpigmentation', 'dehydration'] })
  @IsArray()
  @IsOptional()
  skinConcerns?: string[];

  @ApiPropertyOptional({ example: 28, default: 25 })
  @Type(() => Number)
  @IsInt()
  @Min(12)
  @Max(100)
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isPregnant?: boolean;

  @ApiPropertyOptional({ example: ['Fragrance', 'Nuts'] })
  @IsArray()
  @IsOptional()
  allergies?: string[];

  @ApiPropertyOptional({ example: ['Retinol Serum 0.5%'] })
  @IsArray()
  @IsOptional()
  existingRoutineActives?: string[];

  @ApiPropertyOptional({ example: ['CLEANSER', 'SERUM', 'MOISTURIZER', 'SUNSCREEN'] })
  @IsArray()
  @IsOptional()
  preferredProductTypes?: string[];

  @ApiPropertyOptional({ example: true, default: false })
  @IsBoolean()
  @IsOptional()
  highSunExposure?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  preferVegan?: boolean;
}
