import { VehicleApplicationPayment } from "../../../src/domain/classes/vehicleApplicationPayment";
import { VehicleApplicationPaymentFactory } from "../../../src/domain/factory";
import { createVehicleApplicationPaymentPersistenceData } from "../../utils/createVehicleApplicationPaymentPersistenceData";

describe("VehicleApplicationPaymentFactory", () => {
  it("should successfully create a VehicleApplicationPayment", () => {
    const mockVehicleApplicationPaymentData = createVehicleApplicationPaymentPersistenceData({});
    const result = VehicleApplicationPaymentFactory.create(mockVehicleApplicationPaymentData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(VehicleApplicationPayment);

    const vehicleApplicationPayment = result.getValue();
    expect(vehicleApplicationPayment.id).toBe(mockVehicleApplicationPaymentData.id);
    expect(vehicleApplicationPayment.cashierId).toBe(mockVehicleApplicationPaymentData.cashierId);
    expect(vehicleApplicationPayment.vehicleApplicationId).toBe(
      mockVehicleApplicationPaymentData.vehicleApplicationId
    );
    expect(vehicleApplicationPayment.amountDue.value).toBe(
      mockVehicleApplicationPaymentData.amountDue
    );
    expect(vehicleApplicationPayment.cashTendered.value).toBe(
      mockVehicleApplicationPaymentData.cashTendered
    );
    expect(vehicleApplicationPayment.change).toBe(mockVehicleApplicationPaymentData.change);
    expect(vehicleApplicationPayment.totalAmountPaid).toBe(
      mockVehicleApplicationPaymentData.totalAmountPaid
    );
  });

  it("should fail when cashTendered is less than amountDue", () => {
    const mockVehicleApplicationPaymentData = createVehicleApplicationPaymentPersistenceData({
      amountDue: 1000,
      cashTendered: 900
    });

    const result = VehicleApplicationPaymentFactory.create(mockVehicleApplicationPaymentData);
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(
      "Cash tendered must be equal to or greater than the amount due."
    );
  });
});
