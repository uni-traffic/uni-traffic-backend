import z from "zod";
import { VehicleApplicationStatus } from "../domain/models/vehicleApplication/classes/vehicleApplicationStatus";

export const VehicleApplicationRequestSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string().optional(),
  driverLicenseId: z.string().optional(),
  driverLastName: z.string().optional(),
  driverFirstName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  licensePlate: z.string().optional(),
  status: z.string().optional(),
  applicantId: z.string().optional(),
  userType: z.string().optional(),
  sort: z.enum(["1", "2"]).optional(),
  searchKey: z.string().optional(),
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

export const UpdateVehicleApplicationStatusSchema = z
  .object({
    vehicleApplicationId: z.string({ message: '"id" of the vehicle application must be provided' }),
    status: z.string().refine((value) => VehicleApplicationStatus.validStatuses.includes(value), {
      message: `"status" must be one of: ${VehicleApplicationStatus.validStatuses.join(", ")}`
    }),
    remarks: z.string().optional()
  })
  .refine(
    (data) => {
      return !(data.status === "REJECTED" && !data.remarks);
    },
    {
      message: '"remarks" must be provided when status is REJECTED',
      path: ["remarks"]
    }
  );

export type UpdateVehicleApplicationStatusRequest = z.infer<
  typeof UpdateVehicleApplicationStatusSchema
>;

export const UpdateVehicleApplicationStickerSchema = z.object({
  vehicleApplicationId: z.string({
    message: '"id" of the vehicle application must be provided'
  }),
  stickerNumber: z
    .string({
      message: "Sticker number is required"
    })
    .min(1, {
      message: "Sticker number cannot be empty"
    })
});
export type UpdateVehicleApplicationStickerRequest = z.infer<
  typeof UpdateVehicleApplicationStickerSchema
>;

export const GetVehicleApplicationCountByStatusSchema = z.object({
  status: z
    .enum([
      "APPROVED",
      "PENDING_FOR_STICKER",
      "PENDING_FOR_PAYMENT",
      "PENDING_FOR_SECURITY_APPROVAL",
      "REJECTED"
    ])
    .optional()
});
export type GetVehicleApplicationCountByStatusRequest = z.infer<
  typeof GetVehicleApplicationCountByStatusSchema
>;
