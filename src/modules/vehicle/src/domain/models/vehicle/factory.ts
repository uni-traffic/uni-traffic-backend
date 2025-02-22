import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { Result } from "../../../../../../shared/core/result";
import type { IUserRawObject } from "../../../../../user/src/domain/models/user/constant";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import { type IVehicle, Vehicle } from "./classes/vehicle";
import { VehicleImages } from "./classes/vehicleImages";
import { VehicleLicensePlateNumber } from "./classes/vehicleLicensePlate";
import { VehicleStickerNumber } from "./classes/vehicleStickerNumber";
import { VehicleType } from "./classes/vehicleType";

export interface IVehicleFactoryProps {
  id?: string;
  ownerId: string;
  licensePlate: string;
  make: string;
  model: string;
  series: string;
  color: string;
  type: string;
  images: string[];
  stickerNumber: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  owner: IUserRawObject;
}

export class VehicleFactory {
  public static create(vehicleFactoryProps: IVehicleFactoryProps): Result<IVehicle> {
    const licenseNumberOrError = VehicleLicensePlateNumber.create(vehicleFactoryProps.licensePlate);
    if (licenseNumberOrError.isFailure) {
      return Result.fail<IVehicle>(licenseNumberOrError.getErrorMessage()!);
    }

    const vehicleTypeOrError = VehicleType.create(vehicleFactoryProps.type);
    if (vehicleTypeOrError.isFailure) {
      return Result.fail<IVehicle>(vehicleTypeOrError.getErrorMessage()!);
    }

    const vehicleImagesOrError = VehicleImages.create(vehicleFactoryProps.images);
    if (vehicleImagesOrError.isFailure) {
      return Result.fail<IVehicle>(vehicleImagesOrError.getErrorMessage()!);
    }

    const stickerNumberOrError = VehicleStickerNumber.create(vehicleFactoryProps.stickerNumber);
    if (stickerNumberOrError.isFailure) {
      return Result.fail<IVehicle>(stickerNumberOrError.getErrorMessage()!);
    }

    const ownerOrError = UserFactory.create(vehicleFactoryProps.owner);
    if (ownerOrError.isFailure) {
      return Result.fail<IVehicle>(ownerOrError.getErrorMessage()!);
    }

    return Result.ok<IVehicle>(
      Vehicle.create({
        ...vehicleFactoryProps,
        id: defaultTo(uuid(), vehicleFactoryProps.id),
        licensePlate: licenseNumberOrError.getValue(),
        type: vehicleTypeOrError.getValue(),
        images: vehicleImagesOrError.getValue(),
        stickerNumber: stickerNumberOrError.getValue(),
        createdAt: defaultTo(new Date(), vehicleFactoryProps.createdAt),
        updatedAt: defaultTo(new Date(), vehicleFactoryProps.updatedAt),
        owner: new UserMapper().toDTO(ownerOrError.getValue())
      })
    );
  }
}
