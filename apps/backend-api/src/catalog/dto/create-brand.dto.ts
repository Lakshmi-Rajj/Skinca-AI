import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Aesop', description: 'Brand name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'https://cdn.platform.com/brands/aesop.png', description: 'Logo image URL' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.aesop.com', description: 'Brand official website URL' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: 'Australia', description: 'Country of origin' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'Aesop Retail Pty Ltd', description: 'Manufacturer name' })
  @IsString()
  @IsOptional()
  manufacturer?: string;
}
