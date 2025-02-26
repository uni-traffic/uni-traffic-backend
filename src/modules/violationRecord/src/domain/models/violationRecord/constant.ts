import type { Prisma, User, Vehicle, Violation, ViolationRecord } from "@prisma/client";

export interface IViolationRecordRawObject extends ViolationRecord {
  user?: User;
  reporter?: User;
  violation?: Violation;
  vehicle?: Vehicle;
}
export type IViolationRecordSchema = Prisma.ViolationRecordUncheckedCreateInput;
