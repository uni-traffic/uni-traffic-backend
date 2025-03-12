import { ViolationRecordAuditLog } from "../../../src/domain/models/violationRecordAuditLog/classes/violationRecordAuditLog";
import { ViolationRecordAuditLogType } from "../../../src/domain/models/violationRecordAuditLog/classes/violationRecordAuditLogType";
import { ViolationRecordAuditLogFactory } from "../../../src/domain/models/violationRecordAuditLog/factory";
import { createViolationRecordAuditLogPersistenceData } from "../../utils/createViolationRecordAuditLogPersistenceData";

describe("ViolationRecordAuditLogFactory", () => {
  it("should successfully create a ViolationRecordAuditLog", () => {
    const mockViolationRecordAuditLogData = createViolationRecordAuditLogPersistenceData({});
    const result = ViolationRecordAuditLogFactory.create(mockViolationRecordAuditLogData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordAuditLog);
    expect(result.getValue().id).toBe(mockViolationRecordAuditLogData.id);
    expect(result.getValue().actorId).toBe(mockViolationRecordAuditLogData.actorId);
    expect(result.getValue().auditLogType.value).toBe(mockViolationRecordAuditLogData.auditLogType);
    expect(result.getValue().details).toBe(mockViolationRecordAuditLogData.details);
    expect(result.getValue().violationRecordId).toBe(
      mockViolationRecordAuditLogData.violationRecordId
    );
    expect(result.getValue().createdAt).toBe(mockViolationRecordAuditLogData.createdAt);
    expect(result.getValue().actor).toBeDefined();
    expect(result.getValue().violationRecord).toBeDefined();
  });

  it("should fail to create a ViolationRecordAuditLog if audit type doesnt exist", () => {
    const mockViolationRecordAuditLogData = createViolationRecordAuditLogPersistenceData({});
    const mockViolationRecordAuditLogWithInvalidType = {
      ...mockViolationRecordAuditLogData,
      auditLogType: ""
    };

    const result = ViolationRecordAuditLogFactory.create(
      mockViolationRecordAuditLogWithInvalidType
    );

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${ViolationRecordAuditLogType.validViolationRecordAuditLogType.join(", ")}`
    );
  });
});
