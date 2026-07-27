import { z } from 'zod';

export const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3000'),
  DATABASE_URL: z.string().url('Invalid PostgreSQL DATABASE_URL connection string'),
  REDIS_URL: z.string().url('Invalid REDIS_URL connection string'),
  AUTH0_DOMAIN: z.string().min(1, 'AUTH0_DOMAIN is required'),
  AUTH0_AUDIENCE: z.string().min(1, 'AUTH0_AUDIENCE is required'),
  WIDGET_JWT_PUBLIC_KEY: z.string().min(1, 'WIDGET_JWT_PUBLIC_KEY is required'),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_SQS_TELEMETRY_QUEUE_URL: z.string().url().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(env: Record<string, string | undefined>): Environment {
  const result = environmentSchema.safeParse(env);
  if (!result.success) {
    console.error('❌ Environment validation failed:', result.error.format());
    throw new Error('Invalid environment variables configuration');
  }
  return result.data;
}
