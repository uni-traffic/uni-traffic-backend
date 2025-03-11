import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { IViolationRecordDTO } from "../../../../../../violationRecord/src/dtos/violationRecordDTO";
import type { ViolationRecordPaymentRemarks } from "./violationRecordPaymentRemarks";

export interface IViolationRecordPayment {
  id: string;
  cashierId: string;
  violationRecordId: string;
  amountPaid: number;
  remarks?: ViolationRecordPaymentRemarks;
  timePaid: Date;
  cashier: IUserDTO | undefined;
  violationRecord: IViolationRecordDTO | undefined;
}

export class ViolationRecordPayment implements IViolationRecordPayment {
  private readonly _id: string;
  private readonly _cashierId: string;
  private readonly _violationRecordId: string;
  private readonly _amountPaid: number;
  private readonly _remarks?: ViolationRecordPaymentRemarks;
  private readonly _timePaid: Date;
  private readonly _cashier: IUserDTO | undefined;
  private readonly _violationRecord: IViolationRecordDTO | undefined;

  private constructor({
    id,
    cashierId,
    violationRecordId,
    amountPaid,
    remarks,
    timePaid,
    cashier,
    violationRecord
  }: IViolationRecordPayment) {
    this._id = id;
    this._cashierId = cashierId;
    this._violationRecordId = violationRecordId;
    this._amountPaid = amountPaid;
    this._remarks = remarks;
    this._timePaid = timePaid;
    this._cashier = cashier;
    this._violationRecord = violationRecord;
  }

  get id(): string {
    return this._id;
  }

  get cashierId(): string {
    return this._cashierId;
  }

  get violationRecordId(): string {
    return this._violationRecordId;
  }

  get amountPaid(): number {
    return this._amountPaid;
  }

  get remarks(): ViolationRecordPaymentRemarks | undefined {
    return this._remarks;
  }

  get timePaid(): Date {
    return this._timePaid;
  }

  get cashier(): IUserDTO | undefined {
    return this._cashier;
  }

  get violationRecord(): IViolationRecordDTO | undefined {
    return this._violationRecord;
  }

  public static create(props: IViolationRecordPayment): IViolationRecordPayment {
    return new ViolationRecordPayment(props);
  }
}
