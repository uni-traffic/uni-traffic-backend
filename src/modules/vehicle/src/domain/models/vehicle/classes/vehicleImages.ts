import { Result } from "../../../../../../../shared/core/result";

export class VehicleImages {
  private readonly _value: string[];

  private constructor(value: string[]) {
    this._value = value;
  }

  public static create(value: string[]): Result<VehicleImages> {
    if (value.length > 3) {
      return Result.fail<VehicleImages>("Vehicle images can have at most 3 images.");
    }

    return Result.ok(new VehicleImages(value));
  }

  public get value(): string[] {
    return this._value;
  }

  public insert(imageUrl: string): Result<VehicleImages> {
    if (this._value.length >= 3) {
      return Result.fail<VehicleImages>("Cannot insert more images. Maximum of 3 images allowed.");
    }
    const updatedImages = [...this._value, imageUrl];

    return Result.ok(new VehicleImages(updatedImages));
  }

  public remove(imageUrl: string): Result<void> {
    const imageIndex = this._value.indexOf(imageUrl);
    if (imageIndex === -1) {
      return Result.fail<void>(`Image not found: ${imageUrl}`);
    }

    this._value.splice(imageIndex, 1);

    return Result.ok();
  }
}
