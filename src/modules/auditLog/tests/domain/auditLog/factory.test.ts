import { AuditLogFactory } from "../../../src/domain/models/auditLog/factory";
import { AuditLog } from "../../../src/domain/models/auditLog/classes/auditLog";
import { createAuditLogPersistenceData } from "../../utils/auditLog/createAuditLogPersistenceData";

describe("AuditLogFactory", () => {
  it("should successfully create an AuditLog", () => {
    const mockAuditLogData = createAuditLogPersistenceData({});
    const result = AuditLogFactory.create(mockAuditLogData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(AuditLog);

    const auditLog = result.getValue();
    expect(auditLog.id).toBe(mockAuditLogData.id);
    expect(auditLog.actionType).toBe(mockAuditLogData.actionType);
    expect(auditLog.details).toBe(mockAuditLogData.details);
    expect(auditLog.createdAt).toBe(mockAuditLogData.createdAt);
    expect(auditLog.updatedAt).toBe(mockAuditLogData.updatedAt);
    expect(auditLog.actorId).toBe(mockAuditLogData.actorId);
    expect(auditLog.objectId).toBe(mockAuditLogData.objectId);
  });

  it("should fail when details are empty", () => {
    const mockAuditLogData = createAuditLogPersistenceData({
      details: ""
    });

    const result = AuditLogFactory.create(mockAuditLogData);
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Details cannot be empty");
  });

  it("should fail when details exceed maximum length", () => {
    const mockAuditLogData = createAuditLogPersistenceData({
      details: "a".repeat(1001)
    });

    const result = AuditLogFactory.create(mockAuditLogData);
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Details must be less than 1000 characters");
  });
});
