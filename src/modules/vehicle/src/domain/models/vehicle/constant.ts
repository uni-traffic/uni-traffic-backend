import type { Prisma, User, Vehicle } from "@prisma/client";

export interface IVehicleRawObject extends Vehicle {
  owner?: User;
}
export type IVehicleSchema = Prisma.VehicleUncheckedCreateInput;
