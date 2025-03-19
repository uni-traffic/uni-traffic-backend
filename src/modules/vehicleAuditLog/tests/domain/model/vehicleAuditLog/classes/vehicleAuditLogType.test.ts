import { VehicleAuditLogType } from "../../../../../src/domain/models/vehicleAuditLog/classes/vehicleAuditLogType";

describe("VehicleAuditLogType", () => {
  it("should match a valid auditLogType 'CREATE' ", () => {
    const validAuditLogType = "CREATE";
    const result = VehicleAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleAuditLogType);
    expect(result.getValue().value).toBe("CREATE");
  });

  it("should match a valid auditLogType 'UPDATE' ", () => {
    const validAuditLogType = "UPDATE";
    const result = VehicleAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleAuditLogType);
    expect(result.getValue().value).toBe("UPDATE");
  });

  it("should match a valid auditLogType 'DELETE' ", () => {
    const validAuditLogType = "DELETE";
    const result = VehicleAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleAuditLogType);
    expect(result.getValue().value).toBe("DELETE");
  });

  it("should not match an invalid type", () => {
    const invalidAuditLogType = "FORMATTED";
    const result = VehicleAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${VehicleAuditLogType.validVehicleAuditLogType.join(", ")}`
    );
  });

  it("should not match an invalid type (empty string)", () => {
    const invalidAuditLogType = "";
    const result = VehicleAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${VehicleAuditLogType.validVehicleAuditLogType.join(", ")}`
    );
  });

  it("should not match a mixed case", () => {
    const invalidAuditLogType = "create";
    const result = VehicleAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${VehicleAuditLogType.validVehicleAuditLogType.join(", ")}`
    );
  });
});
