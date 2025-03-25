import { faker } from "@faker-js/faker";
import { AmountDue } from "../../../../src/domain/classes/amountDue";
import { CashTendered } from "../../../../src/domain/classes/cashTendered";
import { VehicleApplicationPayment } from "../../../../src/domain/classes/vehicleApplicationPayment";

describe("VehicleApplicationPayment", () => {
  it("should create a VehicleApplicationPayment", () => {
    const amountDueOrError = AmountDue.create(faker.number.int({ min: 100, max: 1000 }));
    const cashTenderedOrError = CashTendered.create(
      faker.number.int({ min: 100, max: 1000 }),
      amountDueOrError.getValue()
    );

    if (amountDueOrError.isFailure) {
      throw new Error(`AmountDue creation failed: ${amountDueOrError.getErrorMessage()}`);
    }
    if (cashTenderedOrError.isFailure) {
      throw new Error(`CashTendered creation failed: ${cashTenderedOrError.getErrorMessage()}`);
    }

    const mockVehicleApplicationPaymentData = {
      id: faker.string.uuid(),
      cashierId: faker.string.uuid(),
      vehicleApplicationId: faker.string.uuid(),
      amountDue: amountDueOrError.getValue(),
      cashTendered: cashTenderedOrError.getValue(),
      change: faker.number.int({ min: 0, max: 500 }),
      totalAmountPaid: faker.number.int({ min: 100, max: 1500 }),
      date: new Date(),
      cashier: undefined,
      vehicleApplication: undefined
    };

    const vehicleApplicationPayment = VehicleApplicationPayment.create(
      mockVehicleApplicationPaymentData
    );

    expect(vehicleApplicationPayment).toBeInstanceOf(VehicleApplicationPayment);
    expect(vehicleApplicationPayment.id).toBe(mockVehicleApplicationPaymentData.id);
    expect(vehicleApplicationPayment.cashierId).toBe(mockVehicleApplicationPaymentData.cashierId);
    expect(vehicleApplicationPayment.vehicleApplicationId).toBe(
      mockVehicleApplicationPaymentData.vehicleApplicationId
    );
    expect(vehicleApplicationPayment.amountDue).toBe(mockVehicleApplicationPaymentData.amountDue);
    expect(vehicleApplicationPayment.cashTendered).toBe(
      mockVehicleApplicationPaymentData.cashTendered
    );
  });
});
