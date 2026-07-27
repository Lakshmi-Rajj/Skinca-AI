import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({ example: '+15551234567' })
  @IsString()
  @IsOptional()
  phone?: string;
}
