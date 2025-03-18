import { VehicleApplicationStatus } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplicationStatus";

describe("VehicleApplicationStatus", () => {
  it("should match a valid vehicle status 'APPROVED'", () => {
    const validStatus = "APPROVED";
    const vehicleStatusOrFailure = VehicleApplicationStatus.create(validStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(true);
    expect(vehicleStatusOrFailure.getValue()).toBeInstanceOf(VehicleApplicationStatus);
    expect(vehicleStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should match a valid vehicle status 'PENDING_FOR_STICKER'", () => {
    const validStatus = "PENDING_FOR_STICKER";
    const vehicleStatusOrFailure = VehicleApplicationStatus.create(validStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(true);
    expect(vehicleStatusOrFailure.getValue()).toBeInstanceOf(VehicleApplicationStatus);
    expect(vehicleStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should match a valid vehicle status 'PENDING_FOR_PAYMENT'", () => {
    const validStatus = "PENDING_FOR_PAYMENT";
    const vehicleStatusOrFailure = VehicleApplicationStatus.create(validStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(true);
    expect(vehicleStatusOrFailure.getValue()).toBeInstanceOf(VehicleApplicationStatus);
    expect(vehicleStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should match a valid vehicle status 'PENDING_FOR_SECURITY_APPROVAL'", () => {
    const validStatus = "PENDING_FOR_SECURITY_APPROVAL";
    const vehicleStatusOrFailure = VehicleApplicationStatus.create(validStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(true);
    expect(vehicleStatusOrFailure.getValue()).toBeInstanceOf(VehicleApplicationStatus);
    expect(vehicleStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should match a valid vehicle status 'DENIED'", () => {
    const validStatus = "DENIED";
    const vehicleStatusOrFailure = VehicleApplicationStatus.create(validStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(true);
    expect(vehicleStatusOrFailure.getValue()).toBeInstanceOf(VehicleApplicationStatus);
    expect(vehicleStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should not match an invalid vehicle status", () => {
    const invalidStatus = "REJECTED";
    const vehicleStatusOrFailure = VehicleApplicationStatus.create(invalidStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(false);
    expect(vehicleStatusOrFailure.getErrorMessage()).toContain(
      `Invalid VehicleApplication status. Valid types are ${VehicleApplicationStatus.validStatuses.join(", ")}`
    );
  });

  it("should not match an invalid vehicle status (empty string)", () => {
    const invalidStatus = "";
    const vehicleStatusOrFailure = VehicleApplicationStatus.create(invalidStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(false);
    expect(vehicleStatusOrFailure.getErrorMessage()).toContain(
      `Invalid VehicleApplication status. Valid types are ${VehicleApplicationStatus.validStatuses.join(", ")}`
    );
  });

  it("should not match an invalid vehicle status (mixed case)", () => {
    const invalidStatus = "approved";
    const vehicleStatusOrFailure = VehicleApplicationStatus.create(invalidStatus);

    expect(vehicleStatusOrFailure.isSuccess).toBe(false);
    expect(vehicleStatusOrFailure.getErrorMessage()).toContain(
      `Invalid VehicleApplication status. Valid types are ${VehicleApplicationStatus.validStatuses.join(", ")}`
    );
  });
});
