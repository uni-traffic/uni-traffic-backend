import { VehicleType as VehicleTypeSchema } from "@prisma/client";
import { Result } from "../../../../../../../shared/core/result";

export class VehicleType {
  private readonly _value: string;
  public static readonly validVehicleTypes = Object.values<string>(VehicleTypeSchema);

  private constructor(value: string) {
    this._value = value;
  }

  public static create(type: string): Result<VehicleType> {
    if (!VehicleType.validVehicleTypes.includes(type)) {
      return Result.fail<VehicleType>(
        `Invalid vehicle type. Valid types are ${VehicleType.validVehicleTypes.join(", ")}`
      );
    }

    return Result.ok(new VehicleType(type));
  }

  public get value(): string {
    return this._value;
  }
}
