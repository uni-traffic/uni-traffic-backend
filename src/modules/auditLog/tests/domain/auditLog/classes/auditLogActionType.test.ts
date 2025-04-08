import { AuditLogActionType } from "../../../../src/domain/models/auditLog/classes/auditLogActionType";

describe("AuditLogActionType", () => {
  it("should match a valid action type 'CREATE'", () => {
    const validActionTypeTest = "CREATE";
    const actionTypeOrFailure = AuditLogActionType.create(validActionTypeTest);

    expect(actionTypeOrFailure.isSuccess).toBe(true);
    expect(actionTypeOrFailure.getValue()).toBeInstanceOf(AuditLogActionType);
    expect(actionTypeOrFailure.getValue().value).toBe(validActionTypeTest);
  });

  it("should match a valid action type 'UPDATE'", () => {
    const validActionTypeTest = "UPDATE";
    const actionTypeOrFailure = AuditLogActionType.create(validActionTypeTest);

    expect(actionTypeOrFailure.isSuccess).toBe(true);
    expect(actionTypeOrFailure.getValue()).toBeInstanceOf(AuditLogActionType);
    expect(actionTypeOrFailure.getValue().value).toBe(validActionTypeTest);
  });

  it("should match a valid action type 'DELETE'", () => {
    const validActionTypeTest = "DELETE";
    const actionTypeOrFailure = AuditLogActionType.create(validActionTypeTest);

    expect(actionTypeOrFailure.isSuccess).toBe(true);
    expect(actionTypeOrFailure.getValue()).toBeInstanceOf(AuditLogActionType);
    expect(actionTypeOrFailure.getValue().value).toBe(validActionTypeTest);
  });

  it("should fail if action type is invalid", () => {
    const invalidActionTypeTest = "INVALID_ACTION";
    const actionTypeOrFailure = AuditLogActionType.create(invalidActionTypeTest);

    expect(actionTypeOrFailure.isFailure).toBe(true);
    expect(actionTypeOrFailure.getErrorMessage()).toContain(
      `Invalid action type. Valid action type are ${AuditLogActionType.validActionType.join(", ")}`
    );
  });

  it("should fail if action type is empty string", () => {
    const invalidActionTypeTest = "";
    const actionTypeOrFailure = AuditLogActionType.create(invalidActionTypeTest);

    expect(actionTypeOrFailure.isFailure).toBe(true);
    expect(actionTypeOrFailure.getErrorMessage()).toContain(
      `Invalid action type. Valid action type are ${AuditLogActionType.validActionType.join(", ")}`
    );
  });

  it("should fail if action type is mixed case", () => {
    const invalidActionTypeTest = "CreAtE";
    const actionTypeOrFailure = AuditLogActionType.create(invalidActionTypeTest);

    expect(actionTypeOrFailure.isFailure).toBe(true);
    expect(actionTypeOrFailure.getErrorMessage()).toContain(
      `Invalid action type. Valid action type are ${AuditLogActionType.validActionType.join(", ")}`
    );
  });
});
