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

export const VehicleApplicationCreateRequestSchema = z.object({
  schoolId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userType: z.string().refine((value) => value === "STUDENT" || value === "STAFF", {
    message: "userType must be either 'STUDENT' or 'STAFF'"
  }),
  schoolCredential: z.string(),

  driverFirstName: z.string(),
  driverLastName: z.string(),
  driverLicenseId: z.string(),
  driverLicenseImage: z.string(),

  make: z.string(),
  series: z.string(),
  type: z.string(),
  model: z.string(),
  licensePlate: z.string(),
  certificateOfRegistration: z.string(),
  officialReceipt: z.string(),
  frontImage: z.string(),
  sideImage: z.string(),
  backImage: z.string(),

  remarks: z.string().max(150).optional()
});
export type VehicleApplicationCreateRequest = z.infer<typeof VehicleApplicationCreateRequestSchema>;
