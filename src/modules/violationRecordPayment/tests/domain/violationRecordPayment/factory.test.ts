import { ViolationRecordPaymentFactory } from "../../../src/domain/models/violationRecordPayment/factory";
import { createViolationRecordPaymentPersistenceData } from "../../utils/violationRecordPayment/createViolationRecordPaymentPersistenceData";
import { ViolationRecordPayment } from "../../../src/domain/models/violationRecordPayment/classes/violationRecordPayment";

describe("ViolationRecordPaymentFactory", () => {
  it("should successfully create a ViolationRecordPayment", () => {
    const mockViolationRecordPaymentData = createViolationRecordPaymentPersistenceData({});
    const result = ViolationRecordPaymentFactory.create(mockViolationRecordPaymentData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordPayment);

    const violationRecordPayment = result.getValue();
    expect(violationRecordPayment.id).toBe(mockViolationRecordPaymentData.id);
    expect(violationRecordPayment.cashierId).toBe(mockViolationRecordPaymentData.cashierId);
    expect(violationRecordPayment.violationRecordId).toBe(
      mockViolationRecordPaymentData.violationRecordId
    );
    expect(violationRecordPayment.amountPaid).toBe(mockViolationRecordPaymentData.amountPaid);
    expect(violationRecordPayment.remarks?.value).toBe(mockViolationRecordPaymentData.remarks);
  });

  it("should fail when remarks exceed maximum length", () => {
    const mockViolationRecordPaymentData = createViolationRecordPaymentPersistenceData({
      remarks: "a".repeat(151)
    });

    const result = ViolationRecordPaymentFactory.create(mockViolationRecordPaymentData);
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Remarks are limited to 150 characters long");
  });
});
