import { z } from "zod";

export const ViolationRecordRequestSchema = z
  .object({
    id: z.string().optional(),
    vehicleId: z.string().optional(),
    userId: z.string().optional(),
    violationId: z.string().optional(),
    reportedById: z.string().optional(),
    status: z.enum(["UNPAID", "PAID"]).optional()
  })
  .refine((data) => data.vehicleId || data.userId || data.violationId || data.reportedById , {
    message: "At least one of 'vehicleId', 'userId', 'reportedBy', or 'violationId' must be provided."
  });
export type ViolationRecordRequest = z.infer<typeof ViolationRecordRequestSchema>;