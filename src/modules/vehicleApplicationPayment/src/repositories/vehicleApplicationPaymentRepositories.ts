import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IVehicleApplicationPayment } from "../domain/classes/vehicleApplicationPayment";
import {
  type IVehicleApplicationPaymentMapper,
  VehicleApplicationPaymentMapper
} from "../domain/mapper";

export interface IVehicleApplicationPaymentRepository {
  createPayment(payment: IVehicleApplicationPayment): Promise<IVehicleApplicationPayment | null>;
}

export class VehicleApplicationPaymentRepository implements IVehicleApplicationPaymentRepository {
  private _database;
  private _vehicleApplicationPaymentMapper: IVehicleApplicationPaymentMapper;

  public constructor(
    database = db,
    vehicleApplicationMapper: IVehicleApplicationPaymentMapper = new VehicleApplicationPaymentMapper()
  ) {
    this._database = database;
    this._vehicleApplicationPaymentMapper = vehicleApplicationMapper;
  }

  public async createPayment(
    payment: IVehicleApplicationPayment
  ): Promise<IVehicleApplicationPayment | null> {
    try {
      const paymentPersistence = this._vehicleApplicationPaymentMapper.toPersistence(payment);

      const newPayment = await this._database.vehicleApplicationPayment.create({
        data: {
          ...paymentPersistence,
          cashTendered: paymentPersistence.cashTendered,
          amountDue: paymentPersistence.amountDue
        },
        include: {
          vehicleApplication: true,
          cashier: true
        }
      });

      return this._vehicleApplicationPaymentMapper.toDomain(newPayment);
    } catch {
      return null;
    }
  }
}
