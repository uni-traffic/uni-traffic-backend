import type {
  Prisma,
  User,
  Vehicle,
  Violation,
  ViolationRecord,
  ViolationRecordPayment
} from "@prisma/client";

export interface IViolationRecordRawObject extends ViolationRecord {
  user?: User;
  reporter?: User;
  violation?: Violation;
  vehicle?: Vehicle;
  violationRecordPayment?: ViolationRecordPayment | null;
}
export type IViolationRecordSchema = Prisma.ViolationRecordUncheckedCreateInput;
