import { ViolationRecordStatus as ViolationRecordStatusSchema } from "@prisma/client";
import { Result } from "../../../../../../../shared/core/result";

export class ViolationRecordStatus {
  private readonly _value: string;
  public static readonly validVehicleTypes = Object.values<string>(ViolationRecordStatusSchema);

  private constructor(value: string) {
    this._value = value;
  }

  public static create(type: string): Result<ViolationRecordStatus> {
    if (!ViolationRecordStatus.validVehicleTypes.includes(type)) {
      return Result.fail<ViolationRecordStatus>(
        `Invalid ViolationRecord status. Valid types are ${ViolationRecordStatus.validVehicleTypes.join(", ")}`
      );
    }

    return Result.ok(new ViolationRecordStatus(type));
  }

  public get value(): string {
    return this._value;
  }
}
