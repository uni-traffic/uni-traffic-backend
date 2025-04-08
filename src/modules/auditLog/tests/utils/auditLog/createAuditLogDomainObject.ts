import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IAuditLog } from "../../../src/domain/models/auditLog/classes/auditLog";
import type { IAuditLogRawObject } from "../../../src/domain/models/auditLog/constant";
import { AuditLogFactory } from "../../../src/domain/models/auditLog/factory";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { AuditLogAction } from "@prisma/client";

export const createAuditLogDomainObject = ({
  id = uuid(),
  actionType = faker.helpers.arrayElement(Object.values(AuditLogAction)) as AuditLogAction,
  details = faker.lorem.sentence(),
  createdAt = faker.date.past(),
  updatedAt = faker.date.recent(),
  actorId = uuid(),
  objectId = uuid(),
  actor = createUserPersistenceData({})
}: Partial<IAuditLogRawObject>): IAuditLog => {
  const auditLogOrError = AuditLogFactory.create({
    id,
    actionType,
    details,
    createdAt,
    updatedAt,
    actorId,
    objectId,
    actor
  });

  if (auditLogOrError.isFailure) {
    throw new Error(auditLogOrError.getErrorMessage()!);
  }

  return auditLogOrError.getValue();
};
