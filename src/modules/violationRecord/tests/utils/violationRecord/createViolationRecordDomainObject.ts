import { v4 as uuid } from "uuid";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { createVehiclePersistenceData } from "../../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";
import { createViolationPersistenceData } from "../../../../violation/tests/utils/violation/createViolationPersistenceData";
import type { IViolationRecord } from "../../../src/domain/models/violationRecord/classes/violationRecord";
import type { IViolationRecordRawObject } from "../../../src/domain/models/violationRecord/constant";
import { ViolationRecordFactory } from "../../../src/domain/models/violationRecord/factory";

export const createViolationRecordDomainObject = ({
  id = uuid(),
  userId = uuid(),
  reportedById = uuid(),
  violationId = uuid(),
  vehicleId = uuid(),
  status = "UNPAID",
  user = createUserPersistenceData({}),
  reporter = createUserPersistenceData({}),
  violation = createViolationPersistenceData({}),
  vehicle = createVehiclePersistenceData({})
}: Partial<IViolationRecordRawObject>): IViolationRecord => {
  const violationRecordOrError = ViolationRecordFactory.create({
    id,
    userId,
    reportedById,
    violationId,
    vehicleId,
    status,
    user,
    reporter,
    violation,
    vehicle
  });

  return violationRecordOrError.getValue();
};
