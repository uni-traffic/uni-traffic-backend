import { Result } from "../../../../../../../shared/core/result";

export class ViolationRecordRemarks {
  private readonly _value: string;
  public static readonly MAXIMUM_REMARKS_LENGTH = 150;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(remarks: string): Result<ViolationRecordRemarks> {
    if (remarks.length > ViolationRecordRemarks.MAXIMUM_REMARKS_LENGTH) {
      return Result.fail(
        `Remarks are limited to ${ViolationRecordRemarks.MAXIMUM_REMARKS_LENGTH} characters long`
      );
    }

    return Result.ok(new ViolationRecordRemarks(remarks));
  }

  public get value(): string {
    return this._value;
  }
}
