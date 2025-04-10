import type { Prisma, User, VehicleScanLog } from "@prisma/client";

export interface IVehicleScanLogRawObject extends VehicleScanLog {
  security?: User;
}

export type IVehicleScanLogSchema = Prisma.VehicleScanLogUncheckedCreateInput;
