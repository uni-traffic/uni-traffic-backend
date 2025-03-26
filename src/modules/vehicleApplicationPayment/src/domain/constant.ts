import type { Prisma, User, VehicleApplication, VehicleApplicationPayment } from "@prisma/client";

export interface IVehicleApplicationPaymentRawObject extends VehicleApplicationPayment {
  cashier?: User;
  vehicleApplication?: VehicleApplication;
}

export type IVehicleApplicationPaymentSchema = Prisma.VehicleApplicationPaymentUncheckedCreateInput;
