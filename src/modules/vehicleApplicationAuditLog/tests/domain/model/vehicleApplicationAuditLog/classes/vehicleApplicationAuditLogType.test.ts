import { VehicleApplicationAuditLogType } from "../../../../../src/domain/models/vehicleApplicationAuditLog/classes/vehicleApplicationAuditLogType";

describe("VehicleApplicationAuditLogType", () => {
  it("should match a valid auditLogType 'CREATE' ", () => {
    const validAuditLogType = "CREATE";
    const result = VehicleApplicationAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleApplicationAuditLogType);
    expect(result.getValue().value).toBe("CREATE");
  });

  it("should match a valid auditLogType 'UPDATE' ", () => {
    const validAuditLogType = "UPDATE";
    const result = VehicleApplicationAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleApplicationAuditLogType);
    expect(result.getValue().value).toBe("UPDATE");
  });

  it("should match a valid auditLogType 'DELETE' ", () => {
    const validAuditLogType = "DELETE";
    const result = VehicleApplicationAuditLogType.create(validAuditLogType);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleApplicationAuditLogType);
    expect(result.getValue().value).toBe("DELETE");
  });

  it("should not match an invalid type", () => {
    const invalidAuditLogType = "FORMATTED";
    const result = VehicleApplicationAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${VehicleApplicationAuditLogType.validVehicleApplicationAuditLogType.join(", ")}`
    );
  });

  it("should not match an invalid type (empty string)", () => {
    const invalidAuditLogType = "";
    const result = VehicleApplicationAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${VehicleApplicationAuditLogType.validVehicleApplicationAuditLogType.join(", ")}`
    );
  });

  it("should not match a mixed case", () => {
    const invalidAuditLogType = "create";
    const result = VehicleApplicationAuditLogType.create(invalidAuditLogType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${VehicleApplicationAuditLogType.validVehicleApplicationAuditLogType.join(", ")}`
    );
  });
});
