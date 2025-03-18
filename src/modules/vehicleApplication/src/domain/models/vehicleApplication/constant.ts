import type { Prisma, User, VehicleApplication, VehicleApplicationPayment } from "@prisma/client";

export interface IVehicleApplicationRawObject extends VehicleApplication {
  applicant?: User;
  payment?: VehicleApplicationPayment;
}
export type IVehicleApplicationSchema = Prisma.VehicleApplicationUncheckedCreateInput;
