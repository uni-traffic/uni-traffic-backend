import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { VehicleImages } from "./vehicleImages";
import type { VehicleLicensePlateNumber } from "./vehicleLicensePlate";
import type { VehicleStatus } from "./vehicleStatus";
import type { VehicleStickerNumber } from "./vehicleStickerNumber";
import type { VehicleType } from "./vehicleType";

export interface IVehicle {
  id: string;
  ownerId: string;
  licensePlate: VehicleLicensePlateNumber;
  make: string;
  model: string;
  series: string;
  color: string;
  status: VehicleStatus;
  type: VehicleType;
  images: VehicleImages;
  stickerNumber: VehicleStickerNumber;
  createdAt: Date;
  updatedAt: Date;
  owner: IUserDTO | undefined;
}

export class Vehicle implements IVehicle {
  private readonly _id: string;
  private readonly _ownerId: string;
  private readonly _licensePlate: VehicleLicensePlateNumber;
  private readonly _make: string;
  private readonly _model: string;
  private readonly _series: string;
  private readonly _color: string;
  private readonly _status: VehicleStatus;
  private readonly _type: VehicleType;
  private readonly _images: VehicleImages;
  private readonly _stickerNumber: VehicleStickerNumber;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _owner: IUserDTO | undefined;

  private constructor({
    id,
    ownerId,
    licensePlate,
    make,
    model,
    series,
    color,
    type,
    stickerNumber,
    status,
    images,
    createdAt,
    updatedAt,
    owner
  }: IVehicle) {
    this._id = id;
    this._ownerId = ownerId;
    this._licensePlate = licensePlate;
    this._make = make;
    this._model = model;
    this._series = series;
    this._color = color;
    this._type = type;
    this._images = images;
    this._status = status;
    this._stickerNumber = stickerNumber;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._owner = owner;
  }

  get id(): string {
    return this._id;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get licensePlate(): VehicleLicensePlateNumber {
    return this._licensePlate;
  }

  get make(): string {
    return this._make;
  }

  get model(): string {
    return this._model;
  }

  get series(): string {
    return this._series;
  }

  get color(): string {
    return this._color;
  }

  get type(): VehicleType {
    return this._type;
  }

  get images(): VehicleImages {
    return this._images;
  }

  get stickerNumber(): VehicleStickerNumber {
    return this._stickerNumber;
  }

  get status(): VehicleStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get owner(): IUserDTO | undefined {
    return this._owner;
  }

  public static create(props: IVehicle): IVehicle {
    return new Vehicle(props);
  }
}
