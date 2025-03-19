import { VehicleAuditLog } from "../../../../src/domain/models/vehicleAuditLog/classes/vehicleAuditLog";
import { VehicleAuditLogType } from "../../../../src/domain/models/vehicleAuditLog/classes/vehicleAuditLogType";
import { VehicleAuditLogFactory } from "../../../../src/domain/models/vehicleAuditLog/factory";
import { createVehicleAuditLogPersistenceData } from "../../../utils/createVehicleAuditLogPersistenceData";

describe("VehicleAuditLogFactory", () => {
  it("should successfully create a VehicleAuditLog", () => {
    const mockVehicleAuditLogData = createVehicleAuditLogPersistenceData({});
    const result = VehicleAuditLogFactory.create(mockVehicleAuditLogData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleAuditLog);
    expect(result.getValue().id).toBe(mockVehicleAuditLogData.id);
    expect(result.getValue().actorId).toBe(mockVehicleAuditLogData.actorId);
    expect(result.getValue().auditLogType.value).toBe(mockVehicleAuditLogData.auditLogType);
    expect(result.getValue().details).toBe(mockVehicleAuditLogData.details);
    expect(result.getValue().vehicleId).toBe(mockVehicleAuditLogData.vehicleId);
    expect(result.getValue().createdAt).toBe(mockVehicleAuditLogData.createdAt);
    expect(result.getValue().actor).toBeDefined();
    expect(result.getValue().vehicle).toBeDefined();
  });

  it("should fail to create a VehicleAuditLog if audit type doesn't exist", () => {
    const mockVehicleAuditLogData = createVehicleAuditLogPersistenceData({});
    const mockVehicleAuditLogWithInvalidType = {
      ...mockVehicleAuditLogData,
      auditLogType: ""
    };

    const result = VehicleAuditLogFactory.create(mockVehicleAuditLogWithInvalidType);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${VehicleAuditLogType.validVehicleAuditLogType.join(", ")}`
    );
  });
});
