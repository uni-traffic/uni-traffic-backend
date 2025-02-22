import { VehicleType } from "../../../../../src/domain/models/vehicle/classes/vehicleType";

describe("VehicleType", () => {
  it("should match a valid vehicle type 'CAR'", () => {
    const validType = "CAR";
    const vehicleTypeOrFailure = VehicleType.create(validType);

    expect(vehicleTypeOrFailure.isSuccess).toBe(true);
    expect(vehicleTypeOrFailure.getValue()).toBeInstanceOf(VehicleType);
    expect(vehicleTypeOrFailure.getValue().value).toBe(validType);
  });

  it("should match a valid vehicle type 'MOTORCYCLE'", () => {
    const validType = "MOTORCYCLE";
    const vehicleTypeOrFailure = VehicleType.create(validType);

    expect(vehicleTypeOrFailure.isSuccess).toBe(true);
    expect(vehicleTypeOrFailure.getValue()).toBeInstanceOf(VehicleType);
    expect(vehicleTypeOrFailure.getValue().value).toBe(validType);
  });

  it("should not match an invalid vehicle type", () => {
    const invalidType = "TRUCK";
    const vehicleTypeOrFailure = VehicleType.create(invalidType);

    expect(vehicleTypeOrFailure.isSuccess).toBe(false);
    expect(vehicleTypeOrFailure.getErrorMessage()).toContain(
      `Invalid vehicle type. Valid types are ${VehicleType.validVehicleTypes.join(", ")}`
    );
  });

  it("should not match an invalid vehicle type (empty string)", () => {
    const invalidType = "";
    const vehicleTypeOrFailure = VehicleType.create(invalidType);

    expect(vehicleTypeOrFailure.isSuccess).toBe(false);
    expect(vehicleTypeOrFailure.getErrorMessage()).toContain(
      `Invalid vehicle type. Valid types are ${VehicleType.validVehicleTypes.join(", ")}`
    );
  });

  it("should not match an invalid vehicle type (mixed case)", () => {
    const invalidType = "car";
    const vehicleTypeOrFailure = VehicleType.create(invalidType);

    expect(vehicleTypeOrFailure.isSuccess).toBe(false);
    expect(vehicleTypeOrFailure.getErrorMessage()).toContain(
      `Invalid vehicle type. Valid types are ${VehicleType.validVehicleTypes.join(", ")}`
    );
  });
});
