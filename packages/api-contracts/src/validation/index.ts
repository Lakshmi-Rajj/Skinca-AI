import { z } from 'zod';
import { SkinType } from '../enums';

export const questionnaireSubmissionSchema = z.object({
  skinType: z.nativeEnum(SkinType),
  primaryConcerns: z.array(z.string()).min(1).max(3),
  sensitivityRating: z.number().int().min(1).max(5),
  allergies: z.array(z.string()).optional().default([]),
});
