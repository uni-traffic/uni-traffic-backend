import type { User } from "@prisma/client";
import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import { Result } from "../../../../../../shared/core/result";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { type IVehicle, Vehicle } from "./classes/vehicle";
import { VehicleImages } from "./classes/vehicleImages";
import { VehicleLicensePlateNumber } from "./classes/vehicleLicensePlate";
import { VehicleStatus } from "./classes/vehicleStatus";
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
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: User;
}

export class VehicleFactory {
  public static create(props: IVehicleFactoryProps): Result<IVehicle> {
    const licenseNumberOrError = VehicleLicensePlateNumber.create(props.licensePlate);
    if (licenseNumberOrError.isFailure) {
      return Result.fail<IVehicle>(licenseNumberOrError.getErrorMessage()!);
    }

    const vehicleTypeOrError = VehicleType.create(props.type);
    if (vehicleTypeOrError.isFailure) {
      return Result.fail<IVehicle>(vehicleTypeOrError.getErrorMessage()!);
    }

    const vehicleImagesOrError = VehicleImages.create(props.images);
    if (vehicleImagesOrError.isFailure) {
      return Result.fail<IVehicle>(vehicleImagesOrError.getErrorMessage()!);
    }

    const stickerNumberOrError = VehicleStickerNumber.create(props.stickerNumber);
    if (stickerNumberOrError.isFailure) {
      return Result.fail<IVehicle>(stickerNumberOrError.getErrorMessage()!);
    }

    const vehicleStatusOrError = VehicleStatus.create(defaultTo("PENDING", props.status));
    if (vehicleStatusOrError.isFailure) {
      return Result.fail<IVehicle>(vehicleStatusOrError.getErrorMessage()!);
    }

    const ownerOrUndefined = props.owner
      ? VehicleFactory._getUserDTOFromPersistence(props.owner)
      : undefined;

    return Result.ok<IVehicle>(
      Vehicle.create({
        ...props,
        id: defaultTo(uuid(), props.id),
        licensePlate: licenseNumberOrError.getValue(),
        type: vehicleTypeOrError.getValue(),
        images: vehicleImagesOrError.getValue(),
        status: vehicleStatusOrError.getValue(),
        stickerNumber: stickerNumberOrError.getValue(),
        createdAt: defaultTo(new Date(), props.createdAt),
        updatedAt: defaultTo(new Date(), props.updatedAt),
        owner: ownerOrUndefined
      })
    );
  }

  private static _getUserDTOFromPersistence(user: User): IUserDTO {
    const userDomainOrError = UserFactory.create(user);
    if (userDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting User from persistence to Domain");
    }

    return new UserMapper().toDTO(userDomainOrError.getValue());
  }
}
