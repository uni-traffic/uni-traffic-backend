import { v4 as uuid } from "uuid";
import type { IViolationRecordAuditLogRawObject } from "../../src/domain/models/violationRecordAuditLog/constant";
import type { IViolationRecordAuditLog } from "../../src/domain/models/violationRecordAuditLog/classes/violationRecordAuditLog";
import { faker } from "@faker-js/faker";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { createViolationRecordPersistenceData } from "../../../violationRecord/tests/utils/violationRecord/createViolationRecordPersistenceData";
import { ViolationRecordAuditLogFactory } from "../../src/domain/models/violationRecordAuditLog/factory";

export const createViolationRecordAuditLogDomainObject = ({
  id = uuid(),
  actorId = uuid(),
  auditLogType = faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"]),
  violationRecordId = uuid(),
  details = faker.lorem.words(),
  createdAt = new Date(),
  actor = createUserPersistenceData({}),
  violationRecord = createViolationRecordPersistenceData({})
}: Partial<IViolationRecordAuditLogRawObject>): IViolationRecordAuditLog => {
  const violationRecordAuditLogOrError = ViolationRecordAuditLogFactory.create({
    id,
    actorId,
    auditLogType,
    violationRecordId,
    details,
    createdAt,
    actor,
    violationRecord
  });

  if (violationRecordAuditLogOrError.isFailure) {
    throw new Error(violationRecordAuditLogOrError.getErrorMessage()!);
  }

  return violationRecordAuditLogOrError.getValue();
};
