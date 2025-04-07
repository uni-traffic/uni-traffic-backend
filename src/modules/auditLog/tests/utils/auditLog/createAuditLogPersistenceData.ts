import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IAuditLogRawObject } from "../../../src/domain/models/auditLog/constant";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";

export const createAuditLogPersistenceData = ({
  id = uuid(),
  actionType = "CREATE" as const,
  details = faker.lorem.sentence(),
  createdAt = faker.date.past(),
  updatedAt = faker.date.recent(),
  actorId = uuid(),
  objectId = uuid(),
  actor = createUserPersistenceData({})
}: Partial<IAuditLogRawObject>): IAuditLogRawObject => {
  return {
    id,
    actionType,
    details,
    createdAt,
    updatedAt,
    actorId,
    objectId,
    actor
  };
};
