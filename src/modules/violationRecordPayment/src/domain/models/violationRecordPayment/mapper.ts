import { defaultTo } from "rambda";
import type { IViolationRecordPaymentDTO } from "../../../dtos/violationRecordPaymentDTO";
import type { IViolationRecordPayment } from "./classes/violationRecordPayment";
import type { IViolationRecordPaymentRawObject, IViolationRecordPaymentSchema } from "./constant";
import { ViolationRecordPaymentFactory } from "./factory";

export interface IViolationRecordPaymentMapper {
  toPersistence(violationRecordPayment: IViolationRecordPayment): IViolationRecordPaymentSchema;
  toDomain(raw: IViolationRecordPaymentRawObject): IViolationRecordPayment;
  toDTO(violationRecordPayment: IViolationRecordPayment): IViolationRecordPaymentDTO;
}

export class ViolationRecordPaymentMapper implements IViolationRecordPaymentMapper {
  public toPersistence(
    violationRecordPayment: IViolationRecordPayment
  ): IViolationRecordPaymentSchema {
    return {
      id: violationRecordPayment.id,
      cashierId: violationRecordPayment.cashierId,
      violationRecordId: violationRecordPayment.violationRecordId,
      amountPaid: violationRecordPayment.amountPaid,
      remarks: violationRecordPayment.remarks ? violationRecordPayment.remarks.value : null,
      timePaid: violationRecordPayment.timePaid
    };
  }

  public toDomain(raw: IViolationRecordPaymentRawObject): IViolationRecordPayment {
    return ViolationRecordPaymentFactory.create(raw).getValue();
  }

  public toDTO(violationRecordPayment: IViolationRecordPayment): IViolationRecordPaymentDTO {
    return {
      id: violationRecordPayment.id,
      cashierId: violationRecordPayment.cashierId,
      violationRecordId: violationRecordPayment.violationRecordId,
      amountPaid: violationRecordPayment.amountPaid,
      remarks: violationRecordPayment.remarks ? violationRecordPayment.remarks.value : null,
      timePaid: violationRecordPayment.timePaid,
      cashier: defaultTo(null, violationRecordPayment.cashier),
      violationRecord: defaultTo(null, violationRecordPayment.violationRecord)
    };
  }
}
