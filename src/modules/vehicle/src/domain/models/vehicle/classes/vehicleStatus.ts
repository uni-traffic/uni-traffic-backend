import { VehicleStatus as VehicleStatusEnum } from "@prisma/client";
import { Result } from "../../../../../../../shared/core/result";

export class VehicleStatus {
  private readonly _value: string;
  public static readonly validVehicleStatus = Object.values<string>(VehicleStatusEnum);

  private constructor(value: string) {
    this._value = value;
  }

  public static create(status: string): Result<VehicleStatus> {
    if (!VehicleStatus.validVehicleStatus.includes(status)) {
      return Result.fail<VehicleStatus>(
        `Invalid vehicle status. Valid statuses are ${VehicleStatus.validVehicleStatus.join(", ")}`
      );
    }

    return Result.ok(new VehicleStatus(status));
  }

  public get value(): string {
    return this._value;
  }
}
