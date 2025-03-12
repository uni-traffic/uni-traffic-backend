import { faker } from "@faker-js/faker";
import {
  ViolationRecordAuditLog,
  type IViolationRecordAuditLog
} from "../../../../src/domain/models/violationRecordAuditLog/classes/violationRecordAuditLog";
import { ViolationRecordAuditLogType } from "../../../../src/domain/models/violationRecordAuditLog/classes/violationRecordAuditLogType";

describe("ViolationRecordAuditLog", () => {
  it("should create a ViolationRecordAuditLog", () => {
    const mockViolationRecordAuditLog: IViolationRecordAuditLog = {
      id: faker.string.uuid(),
      actorId: faker.string.uuid(),
      auditLogType: ViolationRecordAuditLogType.create(
        faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"])
      ).getValue(),
      violationRecordId: faker.string.uuid(),
      details: faker.lorem.words(),
      createdAt: new Date(),
      actor: undefined,
      violationRecord: undefined
    };

    const violationRecordAuditLog = ViolationRecordAuditLog.create(mockViolationRecordAuditLog);

    expect(violationRecordAuditLog).toBeInstanceOf(ViolationRecordAuditLog);
    expect(violationRecordAuditLog.id).toBe(mockViolationRecordAuditLog.id);
    expect(violationRecordAuditLog.actorId).toBe(mockViolationRecordAuditLog.actorId);
    expect(violationRecordAuditLog.auditLogType).toBe(mockViolationRecordAuditLog.auditLogType);
    expect(violationRecordAuditLog.violationRecordId).toBe(
      mockViolationRecordAuditLog.violationRecordId
    );
    expect(violationRecordAuditLog.details).toBe(mockViolationRecordAuditLog.details);
    expect(violationRecordAuditLog.createdAt).toBe(mockViolationRecordAuditLog.createdAt);
    expect(violationRecordAuditLog.actor).toBe(mockViolationRecordAuditLog.actor);
    expect(violationRecordAuditLog.violationRecord).toBe(
      mockViolationRecordAuditLog.violationRecord
    );
  });
});
