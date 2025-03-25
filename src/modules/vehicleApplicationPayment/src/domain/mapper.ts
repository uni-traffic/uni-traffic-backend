import { defaultTo } from "rambda";
import type { IVehicleApplicationPaymentDTO } from "../dtos/vehicleApplicationPaymentDTO";
import type { IVehicleApplicationPayment } from "./classes/vehicleApplicationPayment";
import type {
  IVehicleApplicationPaymentRawObject,
  IVehicleApplicationPaymentSchema
} from "./constant";
import { VehicleApplicationPaymentFactory } from "./factory";

export interface IVehicleApplicationPaymentMapper {
  toPersistence(payment: IVehicleApplicationPayment): IVehicleApplicationPaymentSchema;
  toDomain(raw: IVehicleApplicationPaymentRawObject): IVehicleApplicationPayment;
  toDTO(payment: IVehicleApplicationPayment): IVehicleApplicationPaymentDTO;
}

export class VehicleApplicationPaymentMapper implements IVehicleApplicationPaymentMapper {
  public toPersistence(payment: IVehicleApplicationPayment): IVehicleApplicationPaymentSchema {
    return {
      id: payment.id,
      amountDue: payment.amountDue.value,
      cashTendered: payment.cashTendered.value,
      change: payment.change,
      totalAmountPaid: payment.totalAmountPaid,
      vehicleApplicationId: payment.vehicleApplicationId,
      cashierId: payment.cashierId,
      date: payment.date
    };
  }

  public toDomain(raw: IVehicleApplicationPaymentRawObject): IVehicleApplicationPayment {
    return VehicleApplicationPaymentFactory.create(raw).getValue();
  }

  public toDTO(payment: IVehicleApplicationPayment): IVehicleApplicationPaymentDTO {
    return {
      id: payment.id,
      amountDue: payment.amountDue.value,
      cashTendered: payment.cashTendered.value,
      change: payment.change,
      totalAmountPaid: payment.totalAmountPaid,
      vehicleApplicationId: payment.vehicleApplicationId,
      cashierId: payment.cashierId,
      date: payment.date,
      cashier: defaultTo(null, payment.cashier),
      vehicleApplication: defaultTo(null, payment.vehicleApplication)
    };
  }
}
