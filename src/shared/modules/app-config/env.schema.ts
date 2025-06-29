import { z } from 'zod';
import { databaseSchema, jwtSchema, securitySchema, serverSchema } from './schemas';

export const environmentSchema = z.object({
  ...serverSchema.shape,
  ...databaseSchema.shape,
  ...securitySchema.shape,
  ...jwtSchema.shape,
});

export type EnvironmentConfig = z.infer<typeof environmentSchema>;
