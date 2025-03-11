import type { Prisma, User, ViolationRecord, ViolationRecordPayment } from "@prisma/client";

export interface IViolationRecordPaymentRawObject extends ViolationRecordPayment {
  cashier?: User;
  violationRecord?: ViolationRecord;
}

export type IViolationRecordPaymentSchema = Prisma.ViolationRecordPaymentUncheckedCreateInput;
