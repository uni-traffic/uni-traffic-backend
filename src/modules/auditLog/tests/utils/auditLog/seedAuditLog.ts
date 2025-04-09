import { faker } from "@faker-js/faker";
import type { AuditLogAction } from "@prisma/client";
import { defaultTo } from "rambda";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { AuditLogActionType } from "../../../src/domain/models/auditLog/classes/auditLogActionType";
import type { IAuditLogSchema } from "../../../src/domain/models/auditLog/constant";

export const seedAuditLog = async ({
  id,
  actionType = faker.helpers.arrayElement(AuditLogActionType.validActionType) as AuditLogAction,
  createdAt,
  updatedAt,
  actorId,
  objectId = faker.string.uuid(),
  details = faker.lorem.sentence()
}: Partial<IAuditLogSchema>) => {
  return db.auditLog.create({
    data: {
      id,
      actionType,
      createdAt,
      updatedAt,
      actorId: defaultTo((await seedUser({})).id, actorId),
      objectId,
      details
    }
  });
};
