import { VehicleScanLogFactory } from "../../../../src/domain/models/vehicleScanLog/factory";
import { VehicleScanLog } from "../../../../src/domain/models/vehicleScanLog/classes/vehicleScanLog";
import { createVehicleScanLogPersistenceData } from "../../../utils/vehicleScanLog/createVehicleScanLogPersistenceData";

describe("VehicleScanLogFactory", () => {
  it("should successfully create a VehicleScanLog", () => {
    const mockData = createVehicleScanLogPersistenceData({});
    const result = VehicleScanLogFactory.create(mockData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleScanLog);

    const vehicleScanLog = result.getValue();
    expect(vehicleScanLog.id).toBe(mockData.id);
    expect(vehicleScanLog.securityId).toBe(mockData.securityId);
    expect(vehicleScanLog.licensePlate).toBe(mockData.licensePlate);
    expect(vehicleScanLog.time).toBe(mockData.time);
  });

  it("should fail when license plate is empty", () => {
    const mockData = createVehicleScanLogPersistenceData({
      licensePlate: ""
    });

    const result = VehicleScanLogFactory.create(mockData);
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("License plate cannot be empty");
  });

  it("should fail when license plate exceeds maximum length", () => {
    const mockData = createVehicleScanLogPersistenceData({
      licensePlate: "A".repeat(21)
    });

    const result = VehicleScanLogFactory.create(mockData);
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("License plate must be less than 20 characters");
  });
});
