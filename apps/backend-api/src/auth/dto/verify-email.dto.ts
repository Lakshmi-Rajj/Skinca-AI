import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'email_verification_token_123', description: 'Account email verification token' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
