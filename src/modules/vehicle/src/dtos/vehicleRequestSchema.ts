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

export const GetVehicleRequestSchema = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional(),
  licensePlate: z.string().optional(),
  stickerNumber: z.string().optional(),
  sort: z.enum(["1", "2"]).optional(),
  searchKey: z.string().optional(),
  count: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
    },
    {
      message: '"count" must be a valid positive whole number'
    }
  ),
  page: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
    },
    {
      message: '"page" must be a valid positive whole number'
    }
  )
});
export type GetVehicleRequest = z.infer<typeof GetVehicleRequestSchema>;
