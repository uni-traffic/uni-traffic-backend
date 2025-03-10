import { VehicleStatus } from "../../../../../src/domain/models/vehicle/classes/vehicleStatus";

describe("VehicleStatus", () => {
  it("should match a valid vehicle status 'REGISTERED'", () => {
    const validStatus = "REGISTERED";
    const vehicleStatusOrFailure = VehicleStatus.create(validStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(true);
    expect(vehicleStatusOrFailure.getValue()).toBeInstanceOf(VehicleStatus);
    expect(vehicleStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should match a valid vehicle status 'PENDING'", () => {
    const validStatus = "PENDING";
    const vehicleStatusOrFailure = VehicleStatus.create(validStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(true);
    expect(vehicleStatusOrFailure.getValue()).toBeInstanceOf(VehicleStatus);
    expect(vehicleStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should not match an invalid vehicle status", () => {
    const invalidStatus = "REJECTED";
    const vehicleStatusOrFailure = VehicleStatus.create(invalidStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(false);
    expect(vehicleStatusOrFailure.getErrorMessage()).toContain(
      `Invalid vehicle status. Valid statuses are ${VehicleStatus.validVehicleStatus.join(", ")}`
    );
  });

  it("should not match an invalid vehicle status (empty string)", () => {
    const invalidStatus = "";
    const vehicleStatusOrFailure = VehicleStatus.create(invalidStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(false);
    expect(vehicleStatusOrFailure.getErrorMessage()).toContain(
      `Invalid vehicle status. Valid statuses are ${VehicleStatus.validVehicleStatus.join(", ")}`
    );
  });

  it("should not match an invalid vehicle status (mixed case)", () => {
    const invalidStatus = "registered";
    const vehicleStatusOrFailure = VehicleStatus.create(invalidStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(false);
    expect(vehicleStatusOrFailure.getErrorMessage()).toContain(
      `Invalid vehicle status. Valid statuses are ${VehicleStatus.validVehicleStatus.join(", ")}`
    );
  });
});
