import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecordPayment } from "../domain/models/violationRecordPayment/classes/violationRecordPayment";
import {
  type IViolationRecordPaymentMapper,
  ViolationRecordPaymentMapper
} from "../domain/models/violationRecordPayment/mapper";
import type {
  GetTotalFineCollectedPerDayByRangeUseCasePayload,
  GetViolationRecordPaymentAmountAndTimePaid
} from "../dtos/violationRecordPaymentDTO";

export interface IViolationRecordPaymentRepository {
  createPayment(payment: IViolationRecordPayment): Promise<IViolationRecordPayment | null>;
  getTotalFineCollectedPerDayByRange(
    params: GetTotalFineCollectedPerDayByRangeUseCasePayload
  ): Promise<GetViolationRecordPaymentAmountAndTimePaid[]>;
}

export class ViolationRecordPaymentRepository implements IViolationRecordPaymentRepository {
  private _database;
  private _violationRecordPaymentMapper: IViolationRecordPaymentMapper;

  public constructor(
    database = db,
    violationRecordPaymentMapper: IViolationRecordPaymentMapper = new ViolationRecordPaymentMapper()
  ) {
    this._database = database;
    this._violationRecordPaymentMapper = violationRecordPaymentMapper;
  }

  public async createPayment(
    payment: IViolationRecordPayment
  ): Promise<IViolationRecordPayment | null> {
    try {
      const paymentPersistence = this._violationRecordPaymentMapper.toPersistence(payment);

      const newPayment = await this._database.violationRecordPayment.create({
        data: {
          ...paymentPersistence,
          amountPaid: Number(paymentPersistence.amountPaid)
        },
        include: {
          cashier: true
        }
      });

      return this._violationRecordPaymentMapper.toDomain(newPayment);
    } catch {
      return null;
    }
  }

  public async getTotalFineCollectedPerDayByRange(
    params: GetTotalFineCollectedPerDayByRangeUseCasePayload
  ): Promise<GetViolationRecordPaymentAmountAndTimePaid[]> {
    try {
      const violationRecordPaymentRaw = await this._database.violationRecordPayment.findMany({
        where: {
          timePaid: {
            gte: params.startDate,
            lte: params.endDate
          }
        },
        select: {
          timePaid: true,
          amountPaid: true
        },
        orderBy: {
          timePaid: "asc"
        }
      });
      return violationRecordPaymentRaw;
    } catch {
      return [];
    }
  }
}
