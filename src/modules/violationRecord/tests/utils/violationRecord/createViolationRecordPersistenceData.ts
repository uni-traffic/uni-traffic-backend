import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { createVehiclePersistenceData } from "../../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";
import { createViolationPersistenceData } from "../../../../violation/tests/utils/violation/createViolationPersistenceData";
import type { IViolationRecordRawObject } from "../../../src/domain/models/violationRecord/constant";

export const createViolationRecordPersistenceData = ({
  id = uuid(),
  violationId = uuid(),
  vehicleId = uuid(),
  userId = uuid(),
  reportedById = uuid(),
  status = faker.helpers.arrayElement(["UNPAID", "PAID"]),
  user = createUserPersistenceData({}),
  reporter = createUserPersistenceData({}),
  violation = createViolationPersistenceData({}),
  vehicle = createVehiclePersistenceData({})
}: Partial<IViolationRecordRawObject>): IViolationRecordRawObject => {
  return {
    id,
    violationId,
    vehicleId,
    userId,
    reportedById,
    status,
    user,
    reporter,
    violation,
    vehicle
  };
};
