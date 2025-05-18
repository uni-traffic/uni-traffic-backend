import { z } from "zod";

export const ViolationRecordPaymentRequestSchema = z.object({
  violationRecordId: z.string().min(1, { message: "Violation Record ID is required." }),
  cashTendered: z.number().min(1, { message: "Cash tendered must be greater than 0" })
});
export type ViolationRecordPaymentRequest = z.infer<typeof ViolationRecordPaymentRequestSchema>;

export const ViolationRecordPaymentGetRequestSchema = z
  .object({
    id: z.string().optional(),
    violationRecordId: z.string().optional(),
    cashierId: z.string().optional()
  })
  .refine((data) => data.id || data.violationRecordId || data.cashierId, {
    message: "At least one of 'id', 'violationRecordId', or 'cashierId' must be provided."
  });
export type ViolationRecordPaymentGetRequest = z.infer<
  typeof ViolationRecordPaymentGetRequestSchema
>;

export const ViolationRecordPaymentGetByRangeRequestSchema = z.object({
  startDate: z.string({ message: "Start Date is required" }),
  endDate: z.string({ message: "End Date is required" })
});
export type ViolationRecordPaymentGetByRangeRequest = z.infer<
  typeof ViolationRecordPaymentGetByRangeRequestSchema
>;
