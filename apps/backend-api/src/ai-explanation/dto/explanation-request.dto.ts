import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { RecommendationResponseDto } from '../../recommendation/dto/recommendation-response.dto';
import { RecommendationRequestDto } from '../../recommendation/dto/recommendation-request.dto';

export class ExplanationRequestDto {
  @ApiProperty({ description: 'Deterministic recommendation engine result payload' })
  @IsObject()
  @IsNotEmpty()
  recommendationResult!: RecommendationResponseDto;

  @ApiProperty({ description: 'Customer skin profile inputs' })
  @IsObject()
  @IsNotEmpty()
  customerProfile!: RecommendationRequestDto;

  @ApiPropertyOptional({ example: 'en', default: 'en' })
  @IsString()
  @IsOptional()
  language?: string;
}
