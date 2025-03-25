import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { createVehicleApplicationPersistenceData } from "../../../vehicleApplication/tests/utils/createVehiclePersistenceData";
import type { IVehicleApplicationPaymentRawObject } from "../../src/domain/constant";

export const createVehicleApplicationPaymentPersistenceData = ({
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
}: Partial<IVehicleApplicationPaymentRawObject>): IVehicleApplicationPaymentRawObject => {
  return {
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
  };
};
