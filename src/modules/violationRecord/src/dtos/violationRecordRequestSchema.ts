import z from "zod";
import { ViolationRecordStatus } from "../domain/models/violationRecord/classes/violationRecordStatus";

export const ViolationRecordCreateSchema = z
  .object({
    violationId: z.string(),
    vehicleId: z.string().optional(),
    licensePlate: z.string().optional(),
    stickerNumber: z.string().optional(),
    remarks: z.string().max(150, "Maximum remarks would be 150").optional()
  })
  .refine((data) => data.vehicleId || data.licensePlate || data.stickerNumber, {
    message: "Either 'vehicleId', 'licensePlate' or 'stickerNumber' must be provided."
  });
export type ViolationRecordCreateRequest = z.infer<typeof ViolationRecordCreateSchema>;

export const ViolationRecordRequestSchema = z.object({
  id: z.string().optional(),
  vehicleId: z.string().optional(),
  userId: z.string().optional(),
  violationId: z.string().optional(),
  reportedById: z.string().optional(),
  sort: z.enum(["1", "2"]).optional(),
  searchKey: z.string().optional(),
  status: z
    .string()
    .refine((value) => ViolationRecordStatus.validVehicleTypes.includes(value), {
      message: `"status" must be one of: ${ViolationRecordStatus.validVehicleTypes.join(", ")}`
    })
    .optional(),
  count: z
    .string()
    .refine(
      (value) => {
        const num = Number(value);
        return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
      },
      {
        message: '"count" must be a valid positive whole number'
      }
    )
    .optional(),
  page: z
    .string()
    .refine(
      (value) => {
        const num = Number(value);
        return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
      },
      {
        message: '"page" must be a valid positive whole number'
      }
    )
    .optional()
});
export type ViolationRecordGetRequest = z.infer<typeof ViolationRecordRequestSchema>;

export const GetViolationsGivenPerDayByRangeRequest = z.object({
  startDate: z.string({ message: "Start Date is required" }),
  endDate: z.string({ message: "End Date is required" })
});
export type ViolationsGivenPerDayByRange = z.infer<typeof GetViolationsGivenPerDayByRangeRequest>;

export const GetTotalViolationGivenByGivenRangeRequest = z.object({
  startDate: z.string({ message: "Start Date is required" }),
  endDate: z.string({ message: "End Date is required" }),
  type: z.enum(["YEAR", "MONTH", "DAY"])
});
export type GetTotalViolationGivenByGivenRange = z.infer<
  typeof GetTotalViolationGivenByGivenRangeRequest
>;
