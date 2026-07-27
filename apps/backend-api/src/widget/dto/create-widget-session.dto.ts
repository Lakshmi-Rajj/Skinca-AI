import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWidgetSessionDto {
  @ApiProperty({ example: 'tenant_uuid_123', description: 'Tenant ID embedding the widget' })
  @IsUUID()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: 'https://store.acmeglow.com', required: false })
  @IsString()
  @IsOptional()
  origin?: string;
}
