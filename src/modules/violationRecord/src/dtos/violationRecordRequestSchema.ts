import z from "zod";

export const ViolationRecordSchema = z
  .object({
    violationId: z.string(),
    vehicleId: z.string().optional(),
    licensePlate: z.string().optional(),
    stickerNumber: z.string().optional()
  })
  .refine((data) => data.vehicleId || data.licensePlate || data.stickerNumber, {
    message: "Either 'vehicleId', 'licensePlate' or 'stickerNumber' must be provided."
  });
export type ViolationRecordRequest = z.infer<typeof ViolationRecordSchema>;

export const ViolationRecordRequestSchema = z
  .object({
    id: z.string().optional(),
    vehicleId: z.string().optional(),
    userId: z.string().optional(),
    violationId: z.string().optional(),
    reportedById: z.string().optional(),
    status: z.enum(["UNPAID", "PAID"]).optional()
  })
  .refine((data) => data.id || data.vehicleId || data.userId || data.violationId || data.reportedById || data.status , {
    message: "At least one of 'vehicleId', 'userId', 'reportedBy', or 'violationId' must be provided."
  });
export type ViolationRecordGetRequest = z.infer<typeof ViolationRecordRequestSchema>;
