import type { AuditLog, Prisma, User } from "@prisma/client";

export interface IAuditLogRawObject extends AuditLog {
  actor?: User;
}

export type IAuditLogSchema = Prisma.AuditLogUncheckedCreateInput;
