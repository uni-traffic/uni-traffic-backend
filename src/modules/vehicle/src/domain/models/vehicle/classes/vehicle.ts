import type { VehicleLicensePlateNumber } from "./vehicleLicenseNumber";
import type { VehicleStickerNumber } from "./vehicleStickerNumber";
import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";

export interface IVehicle {
  id: string;
  ownerId: string;
  licenseNumber: VehicleLicensePlateNumber;
  stickerNumber: VehicleStickerNumber;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: IUserDTO;
}

export class Vehicle implements IVehicle {
  private readonly _id: string;
  private readonly _ownerId: string;
  private readonly _licenseNumber: VehicleLicensePlateNumber;
  private readonly _stickerNumber: VehicleStickerNumber;
  private readonly _isActive: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _owner: IUserDTO;

  private constructor({
    id,
    ownerId,
    licenseNumber,
    stickerNumber,
    isActive,
    createdAt,
    updatedAt,
    owner
  }: {
    id: string;
    ownerId: string;
    licenseNumber: VehicleLicensePlateNumber;
    stickerNumber: VehicleStickerNumber;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: IUserDTO;
  }) {
    this._id = id;
    this._ownerId = ownerId;
    this._licenseNumber = licenseNumber;
    this._stickerNumber = stickerNumber;
    this._isActive = isActive;
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

  get licenseNumber(): VehicleLicensePlateNumber {
    return this._licenseNumber;
  }

  get stickerNumber(): VehicleStickerNumber {
    return this._stickerNumber;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get owner(): IUserDTO {
    return this._owner;
  }

  public static create({
    id,
    ownerId,
    licenseNumber,
    stickerNumber,
    isActive,
    createdAt,
    updatedAt,
    owner
  }: {
    id: string;
    ownerId: string;
    licenseNumber: VehicleLicensePlateNumber;
    stickerNumber: VehicleStickerNumber;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: IUserDTO;
  }): IVehicle {
    return new Vehicle({
      id,
      ownerId,
      licenseNumber,
      stickerNumber,
      isActive,
      createdAt,
      updatedAt,
      owner
    });
  }
}
