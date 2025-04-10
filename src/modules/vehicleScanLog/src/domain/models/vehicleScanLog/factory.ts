import { Result } from "../../../../../../shared/core/result";
import { VehicleScanLog } from "./classes/vehicleScanLog";
import type { IVehicleScanLog } from "./classes/vehicleScanLog";
import type { User } from "@prisma/client";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { uniTrafficId } from "../../../../../../shared/lib/uniTrafficId";

export interface IVehicleScanLogFactoryProps {
  id?: string;
  securityId: string;
  licensePlate: string;
  time?: Date;
  security?: User;
}

export class VehicleScanLogFactory {
  public static create(props: IVehicleScanLogFactoryProps): Result<IVehicleScanLog> {
    if (!props.licensePlate || props.licensePlate.trim().length === 0) {
      return Result.fail("License plate cannot be empty");
    }

    if (props.licensePlate.length > 20) {
      return Result.fail("License plate must be less than 20 characters");
    }

    const securityOrUndefined = props.security
      ? VehicleScanLogFactory._getUserDTOFromPersistence(props.security)
      : undefined;

    return Result.ok<IVehicleScanLog>(
      VehicleScanLog.create({
        ...props,
        id: props.id ?? uniTrafficId(),
        time: props.time ?? new Date(),
        security: securityOrUndefined
      })
    );
  }

  private static _getUserDTOFromPersistence(user: User): IUserDTO {
    const userDomainOrError = UserFactory.create(user);
    if (userDomainOrError.isFailure) {
      throw new Error("Error converting User from persistence to Domain");
    }
    return new UserMapper().toDTO(userDomainOrError.getValue());
  }
}
