import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClaimDto {
  @ApiProperty({ example: 'Hydrating', description: 'Product claim label' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Restores essential skin moisture barrier', description: 'Detailed claim description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'droplet-icon', description: 'Icon identifier' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'BENEFIT', default: 'BENEFIT', description: 'Claim category (e.g., BENEFIT, SAFETY, CERTIFICATION)' })
  @IsString()
  @IsOptional()
  category?: string;
}
