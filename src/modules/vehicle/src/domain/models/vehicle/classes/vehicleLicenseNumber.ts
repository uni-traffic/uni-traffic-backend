import { Result } from "../../../../../../../shared/core/result";

export class VehicleLicensePlateNumber {
  private readonly _value: string;
  private static readonly MIN_LICENSE_REGEX = 1;
  private static readonly MAX_LICENSE_REGEX = 11;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Result<VehicleLicensePlateNumber> {
    if (!VehicleLicensePlateNumber.isLicensePlateValid(value)) {
      return Result.fail<VehicleLicensePlateNumber>(`${value} is not a valid license plate number`);
    }

    return Result.ok<VehicleLicensePlateNumber>(new VehicleLicensePlateNumber(value));
  }

  public get value(): string {
    return this._value;
  }

  private static isLicensePlateValid(value: string): boolean {
    return (
      value.length >= VehicleLicensePlateNumber.MIN_LICENSE_REGEX &&
      value.length <= VehicleLicensePlateNumber.MAX_LICENSE_REGEX
    );
  }
}
