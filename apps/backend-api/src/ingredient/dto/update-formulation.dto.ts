import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FormulationItemDto {
  @ApiProperty({ example: 'ing_hyaluronic_acid_uuid_123', description: 'Global Ingredient UUID' })
  @IsUUID()
  @IsNotEmpty()
  ingredientId!: string;

  @ApiProperty({ example: 0, default: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({ example: 2.00, required: false, description: 'Declared active concentration percentage (0 - 100%)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  declaredConcentration?: number;

  @ApiProperty({ example: '1% - 5%', required: false })
  @IsString()
  @IsOptional()
  approximateRange?: string;

  @ApiProperty({ example: true, default: false, required: false })
  @IsBoolean()
  @IsOptional()
  isPrimaryActive?: boolean;
}

export class UpdateFormulationDto {
  @ApiProperty({ type: [FormulationItemDto], description: 'Ordered list of INCI ingredients in product formulation' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormulationItemDto)
  ingredients!: FormulationItemDto[];
}
