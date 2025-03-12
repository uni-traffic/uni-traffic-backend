import { v4 as uuid } from "uuid";
import type { User, ViolationRecord } from "@prisma/client";
import { Result } from "../../../../../../shared/core/result";
import { ViolationRecordAuditLogType } from "./classes/violationRecordAuditLogType";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IViolationRecordDTO } from "../../../../../violationRecord/src/dtos/violationRecordDTO";
import { ViolationRecordFactory } from "../../../../../violationRecord/src/domain/models/violationRecord/factory";
import { ViolationRecordMapper } from "../../../../../violationRecord/src/domain/models/violationRecord/mapper";
import {
  ViolationRecordAuditLog,
  type IViolationRecordAuditLog
} from "./classes/violationRecordAuditLog";
import { defaultTo } from "rambda";

export interface IViolationRecordAuditLogFactoryProps {
  id?: string;
  actorId: string;
  auditLogType: string;
  violationRecordId: string;
  details: string;
  createdAt?: Date;
  actor?: User;
  violationRecord?: ViolationRecord;
}

export class ViolationRecordAuditLogFactory {
  public static create(
    props: IViolationRecordAuditLogFactoryProps
  ): Result<IViolationRecordAuditLog> {
    const violationRecordAuditLogTypeOrError = ViolationRecordAuditLogType.create(
      props.auditLogType
    );
    if (violationRecordAuditLogTypeOrError.isFailure) {
      return Result.fail(violationRecordAuditLogTypeOrError.getErrorMessage()!);
    }

    const actorOrUndefined = props.actor
      ? ViolationRecordAuditLogFactory._getUserDTOFromPersistence(props.actor)
      : undefined;

    const violationRecordOrUndefined = props.violationRecord
      ? ViolationRecordAuditLogFactory._getViolationRecordDTOFromPersistence(props.violationRecord)
      : undefined;

    return Result.ok<IViolationRecordAuditLog>(
      ViolationRecordAuditLog.create({
        ...props,
        id: defaultTo(uuid(), props.id),
        auditLogType: violationRecordAuditLogTypeOrError.getValue(),
        createdAt: defaultTo(new Date(), props.createdAt),
        actor: actorOrUndefined,
        violationRecord: violationRecordOrUndefined
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

  private static _getViolationRecordDTOFromPersistence(
    violationRecord: ViolationRecord
  ): IViolationRecordDTO {
    const violationRecordDomainOrError = ViolationRecordFactory.create(violationRecord);
    if (violationRecordDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting ViolationRecord from persistence to Domain");
    }

    return new ViolationRecordMapper().toDTO(violationRecordDomainOrError.getValue());
  }
}
