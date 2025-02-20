import z from "zod";

export const VehicleIdSchema = z.object({
  vehicleId: z.string().uuid({ message: "Invalid vehicle ID format" }),
});

export type VehicleIdRequest = z.infer<typeof VehicleIdSchema>;
