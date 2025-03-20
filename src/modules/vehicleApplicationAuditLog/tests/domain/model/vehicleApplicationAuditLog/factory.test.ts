import { VehicleApplicationAuditLog } from "../../../../src/domain/models/vehicleApplicationAuditLog/classes/vehicleApplicationAuditLog";
import { VehicleApplicationAuditLogType } from "../../../../src/domain/models/vehicleApplicationAuditLog/classes/vehicleApplicationAuditLogType";
import { VehicleApplicationAuditLogFactory } from "../../../../src/domain/models/vehicleApplicationAuditLog/factory";
import { createVehicleApplicationAuditLogPersistenceData } from "../../../utils/createVehicleApplicationAuditLogPersistenceData";

describe("VehicleApplicationAuditLogFactory", () => {
  it("should successfully create a VehicleApplicationAuditLog", () => {
    const mockVehicleApplicationAuditLogData = createVehicleApplicationAuditLogPersistenceData({});
    const result = VehicleApplicationAuditLogFactory.create(mockVehicleApplicationAuditLogData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleApplicationAuditLog);
    expect(result.getValue().id).toBe(mockVehicleApplicationAuditLogData.id);
    expect(result.getValue().actorId).toBe(mockVehicleApplicationAuditLogData.actorId);
    expect(result.getValue().auditLogType.value).toBe(
      mockVehicleApplicationAuditLogData.auditLogType
    );
    expect(result.getValue().details).toBe(mockVehicleApplicationAuditLogData.details);
    expect(result.getValue().vehicleApplicationId).toBe(
      mockVehicleApplicationAuditLogData.vehicleApplicationId
    );
    expect(result.getValue().createdAt).toBe(mockVehicleApplicationAuditLogData.createdAt);
    expect(result.getValue().actor).toBeDefined();
    expect(result.getValue().vehicleApplication).toBeDefined();
  });

  it("should fail to create a VehicleApplicationAuditLog if audit type doesn't exist", () => {
    const mockVehicleApplicationAuditLogData = createVehicleApplicationAuditLogPersistenceData({});
    const mockVehicleApplicationAuditLogWithInvalidType = {
      ...mockVehicleApplicationAuditLogData,
      auditLogType: ""
    };

    const result = VehicleApplicationAuditLogFactory.create(
      mockVehicleApplicationAuditLogWithInvalidType
    );

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toContain(
      `Invalid audit log type. Valid types are ${VehicleApplicationAuditLogType.validVehicleApplicationAuditLogType.join(", ")}`
    );
  });
});
