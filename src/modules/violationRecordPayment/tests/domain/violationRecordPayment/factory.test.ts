import { ViolationRecordPayment } from "../../../src/domain/models/violationRecordPayment/classes/violationRecordPayment";
import { ViolationRecordPaymentFactory } from "../../../src/domain/models/violationRecordPayment/factory";
import { createViolationRecordPaymentPersistenceData } from "../../utils/violationRecordPayment/createViolationRecordPaymentPersistenceData";

describe("ViolationRecordPaymentFactory", () => {
  it("should successfully create a ViolationRecordPayment", () => {
    const mockViolationRecordPaymentData = createViolationRecordPaymentPersistenceData({});
    const result = ViolationRecordPaymentFactory.create(mockViolationRecordPaymentData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecordPayment);

    const violationRecordPayment = result.getValue();
    expect(violationRecordPayment.id).toBe(mockViolationRecordPaymentData.id);
    expect(violationRecordPayment.cashierId).toBe(mockViolationRecordPaymentData.cashierId);
    expect(violationRecordPayment.amountDue.value).toBe(mockViolationRecordPaymentData.amountDue);
    expect(violationRecordPayment.cashTendered.value).toBe(
      mockViolationRecordPaymentData.cashTendered
    );
    expect(violationRecordPayment.change).toBe(mockViolationRecordPaymentData.change);
    expect(violationRecordPayment.totalAmountPaid).toBe(
      mockViolationRecordPaymentData.totalAmountPaid
    );
    expect(violationRecordPayment.violationRecordId).toBe(
      mockViolationRecordPaymentData.violationRecordId
    );
  });
});
