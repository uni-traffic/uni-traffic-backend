import { Result } from "../../../../../../shared/core/result";
import { AuditLog } from "./classes/auditLog";
import type { IAuditLog } from "./classes/auditLog";
import type { AuditLogAction, User } from "@prisma/client";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { uniTrafficId } from "../../../../../../shared/lib/uniTrafficId";

export interface IAuditLogFactoryProps {
  id?: string;
  actionType: AuditLogAction;
  details: string;
  createdAt?: Date;
  updatedAt?: Date;
  actorId: string;
  actor?: User;
  objectId: string;
}

export class AuditLogFactory {
  public static create(props: IAuditLogFactoryProps): Result<IAuditLog> {
    if (!props.details || props.details.trim().length === 0) {
      return Result.fail("Details cannot be empty");
    }

    if (props.details.length > 1000) {
      return Result.fail("Details must be less than 1000 characters");
    }

    const actorOrUndefined = props.actor
      ? AuditLogFactory._getUserDTOFromPersistence(props.actor)
      : undefined;

    return Result.ok<IAuditLog>(
      AuditLog.create({
        ...props,
        id: props.id ?? uniTrafficId(),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        actor: actorOrUndefined
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
