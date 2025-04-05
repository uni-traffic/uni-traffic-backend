import { Result } from "../../../../../../../shared/core/result";

export class VehicleStickerNumber {
  private readonly _value: string;
  private static readonly STICKER_LENGTH = 8;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Result<VehicleStickerNumber> {
    if (!VehicleStickerNumber.isValidVehicleStickerNumber(value)) {
      return Result.fail<VehicleStickerNumber>(`${value} is not a valid sticker number`);
    }

    return Result.ok<VehicleStickerNumber>(new VehicleStickerNumber(value));
  }

  public get value(): string {
    return this._value;
  }

  private static isValidVehicleStickerNumber(value: string): boolean {
    return !(value.trim().length < 1);
  }
}
