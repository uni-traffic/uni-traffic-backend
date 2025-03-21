import z from "zod";

export const VehicleApplicationRequestSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().optional(),
  driverLicenseId: z.string().optional(),
  licensePlate: z.string().optional(),
  status: z.string().optional(),
  applicantId: z.string().optional(),
  userType: z.string().optional(),
  count: z.string().refine(
    (value) => {
      const num = Number(value);
      return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
    },
    {
      message: '"count" must be a valid positive whole number'
    }
  ),
  page: z.string().refine(
    (value) => {
      const num = Number(value);
      return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
    },
    {
      message: '"page" must be a valid positive whole number'
    }
  )
});
export type VehicleApplicationGetRequest = z.infer<typeof VehicleApplicationRequestSchema>;
