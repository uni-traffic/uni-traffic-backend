import z from "zod";

export const VehicleApplicationPaymentRequestSchema = z.object({
  vehicleApplicationId: z.string().min(1, { message: "Vehice Application ID is required" }),
  cashTendered: z.number().min(1, { message: "Cash tendered must be greater than 0" }),
  amountDue: z.number()
});

export type VehicleApplicationPaymentRequest = z.infer<
  typeof VehicleApplicationPaymentRequestSchema
>;
