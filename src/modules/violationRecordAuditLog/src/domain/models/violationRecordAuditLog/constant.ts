import type { Prisma, User, ViolationRecord, ViolationRecordAuditLog } from "@prisma/client";

export interface IViolationRecordAuditLogRawObject extends ViolationRecordAuditLog {
  actor?: User;
  violationRecord?: ViolationRecord;
}

export type IViolationRecordAuditLogSchema = Prisma.ViolationRecordAuditLogUncheckedCreateInput;
