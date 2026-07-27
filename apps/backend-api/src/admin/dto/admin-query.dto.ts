import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminQueryDto {
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

  @ApiProperty({ example: 'hyaluronic', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ example: '2026-01-01', required: false })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'json', enum: ['json', 'csv'], required: false })
  @IsEnum(['json', 'csv'])
  @IsOptional()
  format?: 'json' | 'csv' = 'json';
}
