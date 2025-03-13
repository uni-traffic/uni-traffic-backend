import { z } from "zod";

export const ViolationRecordPaymentRequestSchema = z.object({
  violationRecordId: z.string().min(1, { message: "Violation Record ID is required." }),
  amountPaid: z.number().min(1, { message: "Amount paid must be greater than 0." })
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
