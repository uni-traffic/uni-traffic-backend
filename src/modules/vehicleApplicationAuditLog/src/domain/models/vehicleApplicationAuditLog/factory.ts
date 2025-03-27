import { v4 as uuid } from "uuid";
import type { User, VehicleApplication } from "@prisma/client";
import { Result } from "../../../../../../shared/core/result";
import { VehicleApplicationAuditLogType } from "./classes/vehicleApplicationAuditLogType";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import { VehicleApplicationFactory } from "../../../../../vehicleApplication/src/domain/models/vehicleApplication/factory";
import { VehicleApplicationMapper } from "../../../../../vehicleApplication/src/domain/models/vehicleApplication/mapper";
import {
  VehicleApplicationAuditLog,
  type IVehicleApplicationAuditLog
} from "./classes/vehicleApplicationAuditLog";
import { defaultTo } from "rambda";

export interface IVehicleApplicationAuditLogFactoryProps {
  id?: string;
  actorId: string;
  vehicleApplicationId: string;
  auditLogType: string;
  details: string;
  createdAt?: Date;
  actor?: User;
  vehicleApplication?: VehicleApplication;
}

export class VehicleApplicationAuditLogFactory {
  public static create(
    props: IVehicleApplicationAuditLogFactoryProps
  ): Result<IVehicleApplicationAuditLog> {
    const auditLogTypeOrError = VehicleApplicationAuditLogType.create(props.auditLogType);
    if (auditLogTypeOrError.isFailure) {
      return Result.fail(auditLogTypeOrError.getErrorMessage()!);
    }

    const actorOrUndefined = props.actor
      ? VehicleApplicationAuditLogFactory._getUserDTOFromPersistence(props.actor)
      : undefined;

    const vehicleApplicationOrUndefined = props.vehicleApplication
      ? VehicleApplicationAuditLogFactory._getVehicleApplicationDTOFromPersistence(
          props.vehicleApplication
        )
      : undefined;

    return Result.ok<IVehicleApplicationAuditLog>(
      VehicleApplicationAuditLog.create({
        ...props,
        id: defaultTo(uuid(), props.id),
        auditLogType: auditLogTypeOrError.getValue(),
        createdAt: defaultTo(new Date(), props.createdAt),
        actor: actorOrUndefined,
        vehicleApplication: vehicleApplicationOrUndefined
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

  private static _getVehicleApplicationDTOFromPersistence(vehicleApplication: VehicleApplication) {
    const vehicleApplicationDomainOrError = VehicleApplicationFactory.create(vehicleApplication);
    if (vehicleApplicationDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting VehicleApplication from persistence to Domain");
    }

    return new VehicleApplicationMapper().toDTO(vehicleApplicationDomainOrError.getValue());
  }
}
