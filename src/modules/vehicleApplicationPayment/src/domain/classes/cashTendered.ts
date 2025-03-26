import { Result } from "../../../../../shared/core/result";
import type { AmountDue } from "./amountDue";

export class CashTendered {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(cashTendered: number, amountDue: AmountDue): Result<CashTendered> {
    if (cashTendered < amountDue.value) {
      return Result.fail("Cash tendered must be equal to or greater than the amount due.");
    }
    return Result.ok(new CashTendered(cashTendered));
  }

  public get value(): number {
    return this._value;
  }
}
