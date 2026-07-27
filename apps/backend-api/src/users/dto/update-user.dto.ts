import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane', description: 'Updated first name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Smith', description: 'Updated last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'role_uuid_456', description: 'Updated Role UUID' })
  @IsUUID()
  @IsOptional()
  roleId?: string;

  @ApiPropertyOptional({ example: true, description: 'User account active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
