import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'tenant_uuid_123', description: 'Tenant UUID identifier' })
  @IsUUID()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: 'admin@acmeglow.com', description: 'User account email address' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'User account password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
