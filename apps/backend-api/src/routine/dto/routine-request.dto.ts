import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum RoutineTypeEnum {
  MINIMAL = 'MINIMAL',
  STANDARD = 'STANDARD',
  ADVANCED = 'ADVANCED',
  SENSITIVE = 'SENSITIVE',
  PREGNANCY_SAFE = 'PREGNANCY_SAFE',
  BUDGET = 'BUDGET',
  PREMIUM = 'PREMIUM',
}

export class GenerateRoutineRequestDto {
  @ApiProperty({ example: 'cust_uuid_123' })
  @IsUUID()
  @IsNotEmpty()
  customerId!: string;

  @ApiPropertyOptional({ enum: RoutineTypeEnum, default: RoutineTypeEnum.STANDARD })
  @IsEnum(RoutineTypeEnum)
  @IsOptional()
  routineType?: RoutineTypeEnum;

  @ApiPropertyOptional({ example: 'en', default: 'en' })
  @IsString()
  @IsOptional()
  language?: string;
}
