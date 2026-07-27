import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'tenant_uuid_123', description: 'Tenant UUID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: 'admin@acmeglow.com', description: 'User account email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
