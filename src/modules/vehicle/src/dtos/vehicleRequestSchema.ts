import z from "zod";

export const VehicleGetRequestSchema = z
  .object({
    id: z.string().optional(),
    licensePlate: z.string().optional(),
    stickerNumber: z.string().optional()
  })
  .refine((data) => data.id || data.stickerNumber || data.licensePlate, {
    message: "Either 'id', 'licensePlate' or 'stickerNumber' must be provided."
  });
export type VehicleRequest = z.infer<typeof VehicleGetRequestSchema>;
