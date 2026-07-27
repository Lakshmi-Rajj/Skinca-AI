export interface RoutineStep {
  stepNumber: number;
  stepCategory: string;
  productName: string;
  brand: string;
  usageInstructions: string;
}

export interface PersonalizedRoutine {
  routineId: string;
  customerId: string;
  routineType: string;
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  warnings: string[];
  explanation: {
    summary: string;
    keyIngredients: string[];
  };
  generatedAt: string;
}
