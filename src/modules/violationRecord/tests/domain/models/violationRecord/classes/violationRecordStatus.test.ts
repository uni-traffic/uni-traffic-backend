import { ViolationRecordStatus } from "../../../../../src/domain/models/violationRecord/classes/violationRecordStatus";

describe("ViolationRecordStatus", () => {
  it("should match a valid payment status 'UNPAID'", () => {
    const validStatus = "UNPAID";
    const violationRecordStatusOrFailure = ViolationRecordStatus.create(validStatus);

    expect(violationRecordStatusOrFailure.isSuccess).toBe(true);
    expect(violationRecordStatusOrFailure.getValue()).toBeInstanceOf(ViolationRecordStatus);
    expect(violationRecordStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should match a valid payment status 'PAID'", () => {
    const validStatus = "PAID";
    const violationRecordStatusOrFailure = ViolationRecordStatus.create(validStatus);

    expect(violationRecordStatusOrFailure.isSuccess).toBe(true);
    expect(violationRecordStatusOrFailure.getValue()).toBeInstanceOf(ViolationRecordStatus);
    expect(violationRecordStatusOrFailure.getValue().value).toBe(validStatus);
  });

  it("should not match an invalid payment status", () => {
    const invalidStatus = "PENDING";
    const violationRecordStatusOrFailure = ViolationRecordStatus.create(invalidStatus);

    expect(violationRecordStatusOrFailure.isSuccess).toBe(false);
    expect(violationRecordStatusOrFailure.getErrorMessage()).toContain(
      `Invalid ViolationRecord status. Valid types are ${ViolationRecordStatus.validVehicleTypes.join(", ")}`
    );
  });

  it("should not match an invalid payment status (empty string)", () => {
    const invalidStatus = "";
    const violationRecordStatusOrFailure = ViolationRecordStatus.create(invalidStatus);

    expect(violationRecordStatusOrFailure.isSuccess).toBe(false);
    expect(violationRecordStatusOrFailure.getErrorMessage()).toContain(
      `Invalid ViolationRecord status. Valid types are ${ViolationRecordStatus.validVehicleTypes.join(", ")}`
    );
  });

  it("should not match an invalid payment status (mixed case)", () => {
    const invalidStatus = "paid";
    const violationRecordStatusOrFailure = ViolationRecordStatus.create(invalidStatus);

    expect(violationRecordStatusOrFailure.isSuccess).toBe(false);
    expect(violationRecordStatusOrFailure.getErrorMessage()).toContain(
      `Invalid ViolationRecord status. Valid types are ${ViolationRecordStatus.validVehicleTypes.join(", ")}`
    );
  });
});
