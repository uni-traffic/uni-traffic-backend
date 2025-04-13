import { faker } from "@faker-js/faker";
import { VehicleScanLog } from "../../../../../src/domain/models/vehicleScanLog/classes/vehicleScanLog";
import type { IVehicleScanLog } from "../../../../../src/domain/models/vehicleScanLog/classes/vehicleScanLog";

describe("VehicleScanLog", () => {
  it("should create a VehicleScanLog", () => {
    const mockData: IVehicleScanLog = {
      id: faker.string.uuid(),
      securityId: faker.string.uuid(),
      licensePlate: faker.vehicle.vrm(),
      time: faker.date.recent(),
      security: undefined
    };

    const vehicleScanLog = VehicleScanLog.create(mockData);

    expect(vehicleScanLog).toBeInstanceOf(VehicleScanLog);
    expect(vehicleScanLog.id).toBe(mockData.id);
    expect(vehicleScanLog.securityId).toBe(mockData.securityId);
    expect(vehicleScanLog.licensePlate).toBe(mockData.licensePlate);
    expect(vehicleScanLog.time).toBe(mockData.time);
  });
});
