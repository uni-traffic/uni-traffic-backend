import { faker } from "@faker-js/faker";
import {
  type IVehicleApplicationAuditLog,
  VehicleApplicationAuditLog
} from "../../../../../src/domain/models/vehicleApplicationAuditLog/classes/vehicleApplicationAuditLog";
import { VehicleApplicationAuditLogType } from "../../../../../src/domain/models/vehicleApplicationAuditLog/classes/vehicleApplicationAuditLogType";

describe("VehicleApplicationAuditLog", () => {
  it("should create a VehicleApplicationAuditLog", () => {
    const mockVehicleApplicationAuditLog: IVehicleApplicationAuditLog = {
      id: faker.string.uuid(),
      actorId: faker.string.uuid(),
      auditLogType: VehicleApplicationAuditLogType.create(
        faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"])
      ).getValue(),
      vehicleApplicationId: faker.string.uuid(),
      details: faker.lorem.words(),
      createdAt: new Date(),
      actor: undefined,
      vehicleApplication: undefined
    };

    const vehicleApplicationAuditLog = VehicleApplicationAuditLog.create(
      mockVehicleApplicationAuditLog
    );

    expect(vehicleApplicationAuditLog).toBeInstanceOf(VehicleApplicationAuditLog);
    expect(vehicleApplicationAuditLog.id).toBe(mockVehicleApplicationAuditLog.id);
    expect(vehicleApplicationAuditLog.actorId).toBe(mockVehicleApplicationAuditLog.actorId);
    expect(vehicleApplicationAuditLog.auditLogType).toBe(
      mockVehicleApplicationAuditLog.auditLogType
    );
    expect(vehicleApplicationAuditLog.vehicleApplicationId).toBe(
      mockVehicleApplicationAuditLog.vehicleApplicationId
    );
    expect(vehicleApplicationAuditLog.details).toBe(mockVehicleApplicationAuditLog.details);
    expect(vehicleApplicationAuditLog.createdAt).toBe(mockVehicleApplicationAuditLog.createdAt);
    expect(vehicleApplicationAuditLog.actor).toBe(mockVehicleApplicationAuditLog.actor);
    expect(vehicleApplicationAuditLog.vehicleApplication).toBe(
      mockVehicleApplicationAuditLog.vehicleApplication
    );
  });
});
