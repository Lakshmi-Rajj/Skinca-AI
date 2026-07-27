import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class BulkImportDto<T = Record<string, any>> {
  @ApiProperty({ description: 'Array of records to import into catalog' })
  @IsArray()
  @IsNotEmpty()
  records!: T[];
}
