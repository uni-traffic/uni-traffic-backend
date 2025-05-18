import { Result } from "../../../../../../../shared/core/result";
import type { ViolationRecordPaymentAmountDue } from "./violationRecordPaymentAmountDue";

export class ViolationRecordPaymentCashTendered {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(
    cashTendered: number,
    amountDue: ViolationRecordPaymentAmountDue
  ): Result<ViolationRecordPaymentCashTendered> {
    if (cashTendered < amountDue.value) {
      return Result.fail("Cash tendered must be equal to or greater than the amount due.");
    }
    return Result.ok(new ViolationRecordPaymentCashTendered(cashTendered));
  }

  public get value(): number {
    return this._value;
  }
}
