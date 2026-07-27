import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class RecordRecommendationHistoryDto {
  @ApiProperty({ example: 'rec_uuid_123' })
  @IsUUID()
  @IsNotEmpty()
  recommendationId!: string;

  @ApiProperty({ example: 'v4.1.0' })
  @IsString()
  @IsNotEmpty()
  engineVersion!: string;

  @ApiProperty({ example: 95 })
  @IsInt()
  @IsNotEmpty()
  confidenceScore!: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  accepted?: boolean;

  @ApiPropertyOptional({ example: 'Felt very hydrating' })
  @IsString()
  @IsOptional()
  feedback?: string;

  @ApiProperty({ example: [{ productId: 'p1', name: 'Hydrating Cleanser' }] })
  @IsObject()
  @IsNotEmpty()
  products!: any;
}
