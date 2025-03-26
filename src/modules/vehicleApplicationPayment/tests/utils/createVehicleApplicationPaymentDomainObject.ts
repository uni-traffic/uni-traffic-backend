import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { VehicleApplicationPaymentFactory } from "../../src/domain/factory";
import type { IVehicleApplicationPayment } from "../../src/domain/classes/vehicleApplicationPayment";
import type { IVehicleApplicationPaymentRawObject } from "../../src/domain/constant";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { createVehicleApplicationPersistenceData } from "../../../vehicleApplication/tests/utils/createVehiclePersistenceData";

export const createVehicleApplicationPaymentDomainObject = ({
  id = uuid(),
  cashierId = uuid(),
  vehicleApplicationId = uuid(),
  amountDue = faker.number.int({ min: 500, max: 5000 }),
  cashTendered = faker.number.int({ min: amountDue, max: 10000 }),
  change = cashTendered - amountDue,
  totalAmountPaid = cashTendered,
  date = faker.date.past(),
  cashier = createUserPersistenceData({}),
  vehicleApplication = createVehicleApplicationPersistenceData({})
}: Partial<IVehicleApplicationPaymentRawObject>): IVehicleApplicationPayment => {
  const vehicleApplicationPaymentOrError = VehicleApplicationPaymentFactory.create({
    id,
    cashierId,
    vehicleApplicationId,
    amountDue,
    cashTendered,
    change,
    totalAmountPaid,
    date,
    cashier,
    vehicleApplication
  });

  if (vehicleApplicationPaymentOrError.isFailure) {
    throw new Error(vehicleApplicationPaymentOrError.getErrorMessage()!);
  }

  return vehicleApplicationPaymentOrError.getValue();
};
