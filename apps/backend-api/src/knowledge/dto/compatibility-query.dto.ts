import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CompatibilityQueryDto {
  @ApiProperty({ example: 'Retinol', description: 'First INCI ingredient name' })
  @IsString()
  @IsNotEmpty()
  inciName1!: string;

  @ApiProperty({ example: 'Salicylic Acid', description: 'Second INCI ingredient name' })
  @IsString()
  @IsNotEmpty()
  inciName2!: string;
}
