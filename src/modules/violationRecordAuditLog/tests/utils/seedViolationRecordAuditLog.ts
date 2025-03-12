import { faker } from "@faker-js/faker";
import type { IUserRawObject } from "../../../user/src/domain/models/user/constant";
import type { IViolationRecordRawObject } from "../../../violationRecord/src/domain/models/violationRecord/constant";
import type { IViolationRecordAuditLogFactoryProps } from "../../src/domain/models/violationRecordAuditLog/factory";
import { seedViolationRecord } from "../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { defaultTo } from "rambda";
import { uniTrafficId } from "../../../../shared/lib/uniTrafficId";
import type { AuditLogType } from "@prisma/client";

export const seedViolationRecordAuditLog = async ({
  id = uniTrafficId(),
  actorId,
  violationRecordId,
  auditLogType = faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"]),
  details = faker.lorem.words(),
  createdAt = new Date()
}: Partial<IViolationRecordAuditLogFactoryProps> & {
  actor?: Partial<IUserRawObject>;
  violationRecord?: Partial<IViolationRecordRawObject>;
}) => {
  const seededViolationRecord = await seedViolationRecord({});
  const seededActor = await seedUser({ role: "ADMIN" });

  return db.violationRecordAuditLog.create({
    data: {
      id,
      auditLogType: auditLogType as AuditLogType,
      details,
      createdAt,
      actorId: defaultTo(seededActor.id, actorId),
      violationRecordId: defaultTo(seededViolationRecord.id, violationRecordId)
    },
    include: {
      actor: true,
      violationRecord: {
        include: {
          user: true,
          vehicle: true,
          violation: true
        }
      }
    }
  });
};
