import { faker } from "@faker-js/faker";
import {
  type IViolationRecordPayment,
  ViolationRecordPayment
} from "../../../../src/domain/models/violationRecordPayment/classes/violationRecordPayment";
import { ViolationRecordPaymentAmountDue } from "../../../../src/domain/models/violationRecordPayment/classes/violationRecordPaymentAmountDue";
import { ViolationRecordPaymentCashTendered } from "../../../../src/domain/models/violationRecordPayment/classes/violationRecordPaymentCashTendered";

describe("ViolationRecordPayment", () => {
  it("should create a ViolationRecordPayment", () => {
    const amountDueOrError = ViolationRecordPaymentAmountDue.create(
      faker.number.int({ min: 100, max: 1000 })
    );
    const cashTenderedOrError = ViolationRecordPaymentCashTendered.create(
      faker.number.int({ min: amountDueOrError.getValue().value, max: 1000 }),
      amountDueOrError.getValue()
    );
    const change = cashTenderedOrError.getValue().value - amountDueOrError.getValue().value;

    const mockViolationRecordPaymentData: IViolationRecordPayment = {
      id: faker.string.uuid(),
      cashierId: faker.string.uuid(),
      violationRecordId: faker.string.uuid(),
      amountDue: amountDueOrError.getValue(),
      cashTendered: cashTenderedOrError.getValue(),
      change: change,
      totalAmountPaid: cashTenderedOrError.getValue().value - change,
      timePaid: new Date(),
      cashier: undefined,
      violationRecord: undefined
    };

    const violationRecordPayment = ViolationRecordPayment.create(mockViolationRecordPaymentData);

    expect(violationRecordPayment).toBeInstanceOf(ViolationRecordPayment);
    expect(violationRecordPayment.id).toBe(mockViolationRecordPaymentData.id);
    expect(violationRecordPayment.cashierId).toBe(mockViolationRecordPaymentData.cashierId);
    expect(violationRecordPayment.amountDue.value).toBe(
      mockViolationRecordPaymentData.amountDue.value
    );
    expect(violationRecordPayment.cashTendered.value).toBe(
      mockViolationRecordPaymentData.cashTendered.value
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
