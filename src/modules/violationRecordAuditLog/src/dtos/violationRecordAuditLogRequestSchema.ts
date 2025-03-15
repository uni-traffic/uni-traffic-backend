import z from "zod";
import { ViolationRecordAuditLogType } from "../domain/models/violationRecordAuditLog/classes/violationRecordAuditLogType";

export const ViolationRecordAuditLogRequestSchema = z.object({
  auditLogType: z
    .string()
    .refine(
      (value) => ViolationRecordAuditLogType.validViolationRecordAuditLogType.includes(value),
      {
        message: `"type" must be one of: ${ViolationRecordAuditLogType.validViolationRecordAuditLogType.join(", ")}`
      }
    )
    .optional(),
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
  ),
  id: z.string().optional(),
  actorId: z.string().optional(),
  violationRecordId: z.string().optional()
});
export type ViolationRecordAuditLogGetRequest = z.infer<
  typeof ViolationRecordAuditLogRequestSchema
>;
