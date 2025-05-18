import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { IViolationRecordDTO } from "../../../../../../violationRecord/src/dtos/violationRecordDTO";
import type { ViolationRecordPaymentAmountDue } from "./violationRecordPaymentAmountDue";
import type { ViolationRecordPaymentCashTendered } from "./violationRecordPaymentCashTendered";

export interface IViolationRecordPayment {
  id: string;
  cashierId: string;
  violationRecordId: string;

  amountDue: ViolationRecordPaymentAmountDue;
  cashTendered: ViolationRecordPaymentCashTendered;
  change: number;
  totalAmountPaid: number;

  timePaid: Date;
  cashier: IUserDTO | undefined;
  violationRecord: IViolationRecordDTO | undefined;
}

export class ViolationRecordPayment implements IViolationRecordPayment {
  private readonly _id: string;
  private readonly _cashierId: string;
  private readonly _violationRecordId: string;

  private readonly _amountDue: ViolationRecordPaymentAmountDue;
  private readonly _cashTendered: ViolationRecordPaymentCashTendered;
  private readonly _change: number;
  private readonly _totalAmountPaid: number;

  private readonly _timePaid: Date;
  private readonly _cashier: IUserDTO | undefined;
  private readonly _violationRecord: IViolationRecordDTO | undefined;

  private constructor({
    id,
    cashierId,
    violationRecordId,
    amountDue,
    cashTendered,
    change,
    totalAmountPaid,
    timePaid,
    cashier,
    violationRecord
  }: IViolationRecordPayment) {
    this._id = id;
    this._cashierId = cashierId;
    this._violationRecordId = violationRecordId;

    this._amountDue = amountDue;
    this._cashTendered = cashTendered;
    this._change = change;
    this._totalAmountPaid = totalAmountPaid;

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

  get amountDue(): ViolationRecordPaymentAmountDue {
    return this._amountDue;
  }

  get cashTendered(): ViolationRecordPaymentCashTendered {
    return this._cashTendered;
  }

  get change(): number {
    return this._change;
  }

  get totalAmountPaid(): number {
    return this._totalAmountPaid;
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
