import { ViolationRecordAuditLogType } from "../../../../src/domain/models/violationRecordAuditLog/classes/violationRecordAuditLogType";

describe("ViolationRecordAuditLogType", () => {
  it("should match a valid auditLogType 'CREATE' ", () => {
    const validAuditLogType = "CREATE";
    const result = ViolationRecordAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordAuditLogType);
    expect(result.getValue().value).toBe("CREATE");
  });

  it("should match a valid auditLogType 'UPDATE' ", () => {
    const validAuditLogType = "UPDATE";
    const result = ViolationRecordAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordAuditLogType);
    expect(result.getValue().value).toBe("UPDATE");
  });

  it("should match a valid auditLogType 'DELETE' ", () => {
    const validAuditLogType = "DELETE";
    const result = ViolationRecordAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordAuditLogType);
    expect(result.getValue().value).toBe("DELETE");
  });

  it("should not match an invalid type", () => {
    const invalidAuditLogType = "FORMATTED";
    const result = ViolationRecordAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${ViolationRecordAuditLogType.validViolationRecordAuditLogType.join(", ")}`
    );
  });

  it("should not match an invalid type (empty string)", () => {
    const invalidAuditLogType = "";
    const result = ViolationRecordAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${ViolationRecordAuditLogType.validViolationRecordAuditLogType.join(", ")}`
    );
  });

  it("should not match an mixed case", () => {
    const invalidAuditLogType = "create";
    const result = ViolationRecordAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${ViolationRecordAuditLogType.validViolationRecordAuditLogType.join(", ")}`
    );
  });
});
