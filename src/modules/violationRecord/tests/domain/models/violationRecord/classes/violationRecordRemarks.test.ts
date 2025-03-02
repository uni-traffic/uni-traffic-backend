import { ViolationRecordRemarks } from "../../../../../src/domain/models/violationRecord/classes/violationRecordRemarks";

describe("ViolationRecordRemarks", () => {
  it("should create a ViolationRecordRemarks instance when valid", () => {
    const result = ViolationRecordRemarks.create("Valid remarks");

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordRemarks);
    expect(result.getValue().value).toBe("Valid remarks");
  });

  it("should allow empty remarks", () => {
    const result = ViolationRecordRemarks.create("");

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordRemarks);
    expect(result.getValue().value).toBe("");
  });

  it("should fail if remarks exceed maximum characters", () => {
    const longRemarks = "a".repeat(151);
    const result = ViolationRecordRemarks.create(longRemarks);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(
      `Remarks are limited to ${ViolationRecordRemarks.MAXIMUM_REMARKS_LENGTH} characters long`
    );
  });
});
