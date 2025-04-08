import { z } from 'zod';

export const GetTotalUserCountRequestSchema = z.object({
  type: z.enum(['ALL', 'MANAGEMENT', 'APP_USERS']).optional()
});