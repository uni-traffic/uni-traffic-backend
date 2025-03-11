import { ViolationRecordPaymentRemarks } from "../../../../src/domain/models/violationRecordPayment/classes/violationRecordPaymentRemarks";

describe("ViolationRecordPaymentRemarks", () => {
  it("should create a ViolationRecordPaymentRemarks instance when valid", () => {
    const result = ViolationRecordPaymentRemarks.create("Payment completed");

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordPaymentRemarks);
    expect(result.getValue().value).toBe("Payment completed");
  });

  it("should allow empty remarks", () => {
    const result = ViolationRecordPaymentRemarks.create("");

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordPaymentRemarks);
    expect(result.getValue().value).toBe("");
  });

  it("should fail if remarks exceed maximum characters", () => {
    const longRemarks = "a".repeat(151);
    const result = ViolationRecordPaymentRemarks.create(longRemarks);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(
      `Remarks are limited to ${ViolationRecordPaymentRemarks.MAXIMUM_REMARKS_LENGTH} characters long`
    );
  });
});
