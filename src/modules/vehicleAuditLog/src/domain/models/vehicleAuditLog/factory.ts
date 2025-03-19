import { v4 as uuid } from "uuid";
import type { User, Vehicle } from "@prisma/client";
import { Result } from "../../../../../../shared/core/result";
import { VehicleAuditLogType } from "./classes/vehicleAuditLogType";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IVehicleDTO } from "../../../../../vehicle/src/dtos/vehicleDTO";
import { VehicleFactory } from "../../../../../vehicle/src/domain/models/vehicle/factory";
import { VehicleMapper } from "../../../../../vehicle/src/domain/models/vehicle/mapper";
import { VehicleAuditLog, type IVehicleAuditLog } from "./classes/vehicleAuditLog";
import { defaultTo } from "rambda";

export interface IVehicleAuditLogFactoryProps {
  id?: string;
  actorId: string;
  vehicleId: string;
  auditLogType: string;
  details: string;
  createdAt?: Date;
  actor?: User;
  vehicle?: Vehicle;
}

export class VehicleAuditLogFactory {
  public static create(props: IVehicleAuditLogFactoryProps): Result<IVehicleAuditLog> {
    const auditLogTypeOrError = VehicleAuditLogType.create(props.auditLogType);
    if (auditLogTypeOrError.isFailure) {
      return Result.fail(auditLogTypeOrError.getErrorMessage()!);
    }

    const actorOrUndefined = props.actor
      ? VehicleAuditLogFactory._getUserDTOFromPersistence(props.actor)
      : undefined;

    const vehicleOrUndefined = props.vehicle
      ? VehicleAuditLogFactory._getVehicleDTOFromPersistence(props.vehicle)
      : undefined;

    return Result.ok<IVehicleAuditLog>(
      VehicleAuditLog.create({
        ...props,
        id: defaultTo(uuid(), props.id),
        auditLogType: auditLogTypeOrError.getValue(),
        createdAt: defaultTo(new Date(), props.createdAt),
        actor: actorOrUndefined,
        vehicle: vehicleOrUndefined
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

  private static _getVehicleDTOFromPersistence(vehicle: Vehicle): IVehicleDTO {
    const vehicleDomainOrError = VehicleFactory.create(vehicle);
    if (vehicleDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting Vehicle from persistence to Domain");
    }

    return new VehicleMapper().toDTO(vehicleDomainOrError.getValue());
  }
}
