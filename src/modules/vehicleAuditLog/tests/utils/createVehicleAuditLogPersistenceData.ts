import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";
import type { IVehicleAuditLogRawObject } from "../../src/domain/models/vehicleAuditLog/constant";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { createVehiclePersistenceData } from "../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";

export const createVehicleAuditLogPersistenceData = ({
  id = uuid(),
  actorId = uuid(),
  auditLogType = faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"]),
  vehicleId = uuid(),
  details = faker.lorem.words(),
  createdAt = new Date(),
  actor = createUserPersistenceData({}),
  vehicle = createVehiclePersistenceData({})
}: Partial<IVehicleAuditLogRawObject>): IVehicleAuditLogRawObject => {
  return {
    id,
    actorId,
    auditLogType,
    vehicleId,
    details,
    createdAt,
    actor,
    vehicle
  };
};
