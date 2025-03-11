import { faker } from "@faker-js/faker";
import {
  IViolationRecordPayment,
  ViolationRecordPayment
} from "../../../../src/domain/models/violationRecordPayment/classes/violationRecordPayment";
import { ViolationRecordPaymentRemarks } from "../../../../src/domain/models/violationRecordPayment/classes/violationRecordPaymentRemarks";

describe("ViolationRecordPayment", () => {
  it("should create a ViolationRecordPayment", () => {
    const mockViolationRecordPaymentData: IViolationRecordPayment = {
      id: faker.string.uuid(),
      cashierId: faker.string.uuid(),
      violationRecordId: faker.string.uuid(),
      amountPaid: faker.number.int({ min: 250, max: 1000 }),
      remarks: ViolationRecordPaymentRemarks.create(faker.lorem.sentence()).getValue(),
      timePaid: new Date(),
      cashier: undefined,
      violationRecord: undefined
    };

    const violationRecordPayment = ViolationRecordPayment.create(mockViolationRecordPaymentData);

    expect(violationRecordPayment).toBeInstanceOf(ViolationRecordPayment);
    expect(violationRecordPayment.id).toBe(mockViolationRecordPaymentData.id);
    expect(violationRecordPayment.cashierId).toBe(mockViolationRecordPaymentData.cashierId);
    expect(violationRecordPayment.violationRecordId).toBe(
      mockViolationRecordPaymentData.violationRecordId
    );
    expect(violationRecordPayment.amountPaid).toBe(mockViolationRecordPaymentData.amountPaid);
    expect(violationRecordPayment.remarks?.value).toBe(
      mockViolationRecordPaymentData.remarks?.value
    );
  });
});
