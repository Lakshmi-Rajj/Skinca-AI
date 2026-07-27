import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123!', description: 'Existing account password' })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({ example: 'NewSecurePassword456!', description: 'New account password (min 8 chars)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;
}
