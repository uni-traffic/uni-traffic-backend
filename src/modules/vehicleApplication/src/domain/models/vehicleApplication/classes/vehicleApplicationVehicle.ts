import { Result } from "../../../../../../../shared/core/result";

export class VehicleApplicationVehicle {
  private readonly _make: string;
  private readonly _series: string;
  private readonly _type: string;
  private readonly _model: string;
  private readonly _licensePlate: string;
  private readonly _certificateOfRegistration: string;
  private readonly _officialReceipt: string;
  private readonly _frontImage: string;
  private readonly _sideImage: string;
  private readonly _backImage: string;
  public static readonly validVehicleTypes = ["CAR", "MOTORCYCLE"];

  private constructor(props: {
    make: string;
    series: string;
    type: string;
    model: string;
    licensePlate: string;
    certificateOfRegistration: string;
    officialReceipt: string;
    frontImage: string;
    sideImage: string;
    backImage: string;
  }) {
    this._make = props.make;
    this._series = props.series;
    this._type = props.type;
    this._model = props.model;
    this._licensePlate = props.licensePlate;
    this._certificateOfRegistration = props.certificateOfRegistration;
    this._officialReceipt = props.officialReceipt;
    this._frontImage = props.frontImage;
    this._sideImage = props.sideImage;
    this._backImage = props.backImage;
  }

  public static create(props: {
    make: string;
    series: string;
    type: string;
    model: string;
    licensePlate: string;
    certificateOfRegistration: string;
    officialReceipt: string;
    frontImage: string;
    sideImage: string;
    backImage: string;
  }): Result<VehicleApplicationVehicle> {
    if (!VehicleApplicationVehicle.validVehicleTypes.includes(props.type)) {
      return Result.fail(
        `Invalid Vehicle type. Valid types are ${VehicleApplicationVehicle.validVehicleTypes.join(", ")}`
      );
    }

    return Result.ok(new VehicleApplicationVehicle(props));
  }

  get make(): string {
    return this._make;
  }

  get series(): string {
    return this._series;
  }

  get type(): string {
    return this._type;
  }

  get model(): string {
    return this._model;
  }

  get licensePlate(): string {
    return this._licensePlate;
  }

  get certificateOfRegistration(): string {
    return this._certificateOfRegistration;
  }

  get officialReceipt(): string {
    return this._officialReceipt;
  }

  get frontImage(): string {
    return this._frontImage;
  }

  get sideImage(): string {
    return this._sideImage;
  }

  get backImage(): string {
    return this._backImage;
  }
}
