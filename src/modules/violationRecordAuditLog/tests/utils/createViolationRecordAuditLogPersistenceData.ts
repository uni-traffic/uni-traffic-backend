import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IViolationRecordAuditLogRawObject } from "../../src/domain/models/violationRecordAuditLog/constant";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { createViolationRecordPersistenceData } from "../../../violationRecord/tests/utils/violationRecord/createViolationRecordPersistenceData";

export const createViolationRecordAuditLogPersistenceData = ({
  id = uuid(),
  actorId = uuid(),
  auditLogType = faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"]),
  violationRecordId = uuid(),
  details = faker.lorem.words(),
  createdAt = new Date(),
  actor = createUserPersistenceData({}),
  violationRecord = createViolationRecordPersistenceData({})
}: Partial<IViolationRecordAuditLogRawObject>): IViolationRecordAuditLogRawObject => {
  return {
    id,
    actorId,
    auditLogType,
    violationRecordId,
    details,
    createdAt,
    actor,
    violationRecord
  };
};
