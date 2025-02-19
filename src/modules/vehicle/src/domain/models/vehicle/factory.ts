import { Vehicle, type IVehicle } from "./classes/vehicle";
import { VehicleLicensePlateNumber } from "./classes/vehicleLicenseNumber";
import { VehicleStickerNumber } from "./classes/vehicleStickerNumber";
import { Result } from "../../../../../../shared/core/result";
import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import type {} from "../../../../../user/src/domain/models/user/classes/user";
import type { IUserRawObject } from "../../../../../user/src/domain/models/user/constant";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";

export interface IVehicleFactoryProps {
  id?: string;
  ownerId: string;
  licenseNumber: string;
  stickerNumber: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  owner: IUserRawObject;
}

export class VehicleFactory {
  public static create(vehicleFactoryProps: IVehicleFactoryProps): Result<IVehicle> {
    const licenseNumberOrError = VehicleLicensePlateNumber.create(
      vehicleFactoryProps.licenseNumber
    );
    if (licenseNumberOrError.isFailure) {
      return Result.fail<IVehicle>(licenseNumberOrError.getErrorMessage()!);
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
        licenseNumber: licenseNumberOrError.getValue(),
        stickerNumber: stickerNumberOrError.getValue(),
        createdAt: defaultTo(new Date(), vehicleFactoryProps.createdAt),
        updatedAt: defaultTo(new Date(), vehicleFactoryProps.updatedAt),
        owner: new UserMapper().toDTO(ownerOrError.getValue())
      })
    );
  }
}
