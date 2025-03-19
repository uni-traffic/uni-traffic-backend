import type { Prisma, User, Vehicle, VehicleAuditLog } from "@prisma/client";

export interface IVehicleAuditLogRawObject extends VehicleAuditLog {
  actor?: User;
  vehicle?: Vehicle;
}

export type IVehicleAuditLogSchema = Prisma.VehicleAuditLogUncheckedCreateInput;
