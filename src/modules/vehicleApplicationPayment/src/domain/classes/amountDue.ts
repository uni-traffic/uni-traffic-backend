import { Result } from "../../../../../shared/core/result";

export class AmountDue {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(amountDue: number): Result<AmountDue> {
    if (amountDue <= 0) {
      return Result.fail("Amount due must be greater than zero.");
    }
    return Result.ok(new AmountDue(amountDue));
  }

  public get value(): number {
    return this._value;
  }
}
