import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IVehicleScanLog } from "../../../src/domain/models/vehicleScanLog/classes/vehicleScanLog";
import type { IVehicleScanLogRawObject } from "../../../src/domain/models/vehicleScanLog/constant";
import { VehicleScanLogFactory } from "../../../src/domain/models/vehicleScanLog/factory";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";

export const createVehicleScanLogDomainObject = ({
  id = uuid(),
  securityId = uuid(),
  licensePlate = faker.vehicle.vrm(),
  time = faker.date.recent(),
  security = createUserPersistenceData({})
}: Partial<IVehicleScanLogRawObject>): IVehicleScanLog => {
  const vehicleScanLogOrError = VehicleScanLogFactory.create({
    id,
    securityId,
    licensePlate,
    time,
    security
  });

  if (vehicleScanLogOrError.isFailure) {
    throw new Error(vehicleScanLogOrError.getErrorMessage()!);
  }

  return vehicleScanLogOrError.getValue();
};
