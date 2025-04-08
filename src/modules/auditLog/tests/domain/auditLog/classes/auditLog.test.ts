import { faker } from "@faker-js/faker";
import { AuditLog } from "../../../../src/domain/models/auditLog/classes/auditLog";
import type { IAuditLog } from "../../../../src/domain/models/auditLog/classes/auditLog";
import { AuditLogActionType } from "../../../../src/domain/models/auditLog/classes/auditLogActionType";

describe("AuditLog", () => {
  it("should create an AuditLog", () => {
    const mockAuditLogData: IAuditLog = {
      id: faker.string.uuid(),
      actionType: AuditLogActionType.create(
        faker.helpers.arrayElement(AuditLogActionType.validActionType)
      ).getValue(),
      details: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      actorId: faker.string.uuid(),
      objectId: faker.string.uuid(),
      actor: undefined
    };

    const auditLog = AuditLog.create(mockAuditLogData);

    expect(auditLog).toBeInstanceOf(AuditLog);
    expect(auditLog.id).toBe(mockAuditLogData.id);
    expect(auditLog.actionType).toBe(mockAuditLogData.actionType);
    expect(auditLog.details).toBe(mockAuditLogData.details);
    expect(auditLog.createdAt).toBe(mockAuditLogData.createdAt);
    expect(auditLog.updatedAt).toBe(mockAuditLogData.updatedAt);
    expect(auditLog.actorId).toBe(mockAuditLogData.actorId);
    expect(auditLog.objectId).toBe(mockAuditLogData.objectId);
  });
});
