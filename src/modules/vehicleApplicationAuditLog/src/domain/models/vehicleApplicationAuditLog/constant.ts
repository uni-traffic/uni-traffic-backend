import type { Prisma, User, VehicleApplication, VehicleApplicationAuditLog } from "@prisma/client";

export interface IVehicleApplicationAuditLogRawObject extends VehicleApplicationAuditLog {
  actor?: User;
  vehicleApplication?: VehicleApplication;
}

export type IVehicleApplicationAuditLogSchema =
  Prisma.VehicleApplicationAuditLogUncheckedCreateInput;
