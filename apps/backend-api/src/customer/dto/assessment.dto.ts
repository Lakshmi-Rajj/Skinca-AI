import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsUUID } from 'class-validator';

export class AssessmentSubmissionDto {
  @ApiProperty({ example: 'cust_uuid_123' })
  @IsUUID()
  @IsNotEmpty()
  customerId!: string;

  @ApiProperty({
    example: {
      skinType: 'COMBINATION',
      primaryConcern: 'acne',
      secondaryConcern: 'hyperpigmentation',
      sensitivity: 'HIGH',
      isPregnant: false,
      allergies: ['Fragrance'],
    },
  })
  @IsObject()
  @IsNotEmpty()
  questionnaireAnswers!: Record<string, any>;
}
