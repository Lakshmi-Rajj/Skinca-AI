import { RoutineStep } from '../../recommendation/dto/recommendation-response.dto';
import { RecommendationExplanationResponse } from '../../ai-explanation/dto/explanation-response.dto';

export interface PersonalizedRoutineResponseDto {
  routineId: string;
  customerId: string;
  routineType: string;
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  warnings: string[];
  explanation: RecommendationExplanationResponse;
  generatedAt: Date;
}
