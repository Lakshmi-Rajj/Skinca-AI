export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  skinType?: string;
  primaryConcern?: string;
  secondaryConcern?: string;
  sensitivity?: string;
  isPregnant?: boolean;
  allergies?: string[];
}

export interface AssessmentAnswers {
  skinType: string;
  primaryConcern: string;
  secondaryConcern?: string;
  sensitivity: string;
  isPregnant: boolean;
  allergies?: string;
}
