import { Result } from "../../../../../../../shared/core/result";

export class ViolationRecordPaymentRemarks {
  private readonly _value: string;
  public static readonly MAXIMUM_REMARKS_LENGTH = 150;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(remarks: string): Result<ViolationRecordPaymentRemarks> {
    if (remarks.length > ViolationRecordPaymentRemarks.MAXIMUM_REMARKS_LENGTH) {
      return Result.fail(
        `Remarks are limited to ${ViolationRecordPaymentRemarks.MAXIMUM_REMARKS_LENGTH} characters long`
      );
    }

    return Result.ok(new ViolationRecordPaymentRemarks(remarks));
  }

  public get value(): string {
    return this._value;
  }
}
