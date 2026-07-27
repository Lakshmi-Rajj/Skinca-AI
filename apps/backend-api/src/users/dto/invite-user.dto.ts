import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class InviteUserDto {
  @ApiProperty({ example: 'staff.member@acmeglow.com', description: 'Invited user email address' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Sarah', description: 'First name of invited user' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Connor', description: 'Last name of invited user' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'role_uuid_789', description: 'Assigned Role UUID' })
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;
}
