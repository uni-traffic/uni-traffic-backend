import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IVehicleScanLogRawObject } from "../../../src/domain/models/vehicleScanLog/constant";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";

export const createVehicleScanLogPersistenceData = ({
  id = uuid(),
  securityId = uuid(),
  licensePlate = faker.vehicle.vrm(),
  time = faker.date.recent(),
  security = createUserPersistenceData({})
}: Partial<IVehicleScanLogRawObject>): IVehicleScanLogRawObject => {
  return {
    id,
    securityId,
    licensePlate,
    time,
    security
  };
};
