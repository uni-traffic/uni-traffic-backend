import { faker } from "@faker-js/faker";
import {
  type IVehicleAuditLog,
  VehicleAuditLog
} from "../../../../../src/domain/models/vehicleAuditLog/classes/vehicleAuditLog";
import { VehicleAuditLogType } from "../../../../../src/domain/models/vehicleAuditLog/classes/vehicleAuditLogType";

describe("VehicleAuditLog", () => {
  it("should create a VehicleAuditLog", () => {
    const mockVehicleAuditLog: IVehicleAuditLog = {
      id: faker.string.uuid(),
      actorId: faker.string.uuid(),
      auditLogType: VehicleAuditLogType.create(
        faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"])
      ).getValue(),
      vehicleId: faker.string.uuid(),
      details: faker.lorem.words(),
      createdAt: new Date(),
      actor: undefined,
      vehicle: undefined
    };

    const vehicleAuditLog = VehicleAuditLog.create(mockVehicleAuditLog);

    expect(vehicleAuditLog).toBeInstanceOf(VehicleAuditLog);
    expect(vehicleAuditLog.id).toBe(mockVehicleAuditLog.id);
    expect(vehicleAuditLog.actorId).toBe(mockVehicleAuditLog.actorId);
    expect(vehicleAuditLog.auditLogType).toBe(mockVehicleAuditLog.auditLogType);
    expect(vehicleAuditLog.vehicleId).toBe(mockVehicleAuditLog.vehicleId);
    expect(vehicleAuditLog.details).toBe(mockVehicleAuditLog.details);
    expect(vehicleAuditLog.createdAt).toBe(mockVehicleAuditLog.createdAt);
    expect(vehicleAuditLog.actor).toBe(mockVehicleAuditLog.actor);
    expect(vehicleAuditLog.vehicle).toBe(mockVehicleAuditLog.vehicle);
  });
});
