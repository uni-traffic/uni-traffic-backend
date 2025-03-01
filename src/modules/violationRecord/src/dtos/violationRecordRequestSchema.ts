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
