import { VehicleLicensePlateNumber } from "../../../../../src/domain/models/vehicle/classes/vehicleLicensePlate";

describe("VehicleLicensePlateNumber", () => {
  it("should match valid diplomatic corps plate", () => {
    const validPlate = "1000";
    const vehicleOrFailure = VehicleLicensePlateNumber.create(validPlate);

    expect(vehicleOrFailure.isSuccess).toBe(true);
    expect(vehicleOrFailure.getValue()).toBeInstanceOf(VehicleLicensePlateNumber);
    expect(vehicleOrFailure.getValue().value).toBe(validPlate);
  });

  it("should match valid license plates", () => {
    const validPlate = "CDH 3311";
    const vehicleOrFailure = VehicleLicensePlateNumber.create(validPlate);

    expect(vehicleOrFailure.isSuccess).toBe(true);
    expect(vehicleOrFailure.getValue()).toBeInstanceOf(VehicleLicensePlateNumber);
    expect(vehicleOrFailure.getValue().value).toBe(validPlate.replace(" ", ""));
  });

  it("should not match invalid license plates", () => {
    const emptyString = "";
    const vehicleOrFailure = VehicleLicensePlateNumber.create(emptyString);

    expect(vehicleOrFailure.isSuccess).toBe(false);
    expect(vehicleOrFailure.getErrorMessage()).toContain("is not a valid license plate number");
  });
});
