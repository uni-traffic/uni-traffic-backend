import { Result } from "../../../../../../../shared/core/result";

export class VehicleApplicationDriver {
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _licenseId: string;
  private readonly _licenseImage: string;
  private readonly _selfiePicture: string;

  private constructor(props: {
    firstName: string;
    lastName: string;
    licenseId: string;
    licenseImage: string;
    selfiePicture: string;
  }) {
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._licenseId = props.licenseId;
    this._licenseImage = props.licenseImage;
    this._selfiePicture = props.selfiePicture;
  }

  public static create(props: {
    firstName: string;
    lastName: string;
    licenseId: string;
    licenseImage: string;
    selfiePicture: string;
  }): Result<VehicleApplicationDriver> {
    return Result.ok(new VehicleApplicationDriver(props));
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get licenseId(): string {
    return this._licenseId;
  }

  get licenseImage(): string {
    return this._licenseImage;
  }

  get selfiePicture(): string {
    return this._selfiePicture;
  }
}
