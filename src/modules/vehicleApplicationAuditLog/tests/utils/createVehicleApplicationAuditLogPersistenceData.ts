import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";
import type { IVehicleApplicationAuditLogRawObject } from "../../src/domain/models/vehicleApplicationAuditLog/constant";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { createVehicleApplicationPersistenceData } from "../../../vehicleApplication/tests/utils/createVehiclePersistenceData";

export const createVehicleApplicationAuditLogPersistenceData = ({
  id = uuid(),
  actorId = uuid(),
  auditLogType = faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"]),
  vehicleApplicationId = uuid(),
  details = faker.lorem.words(),
  createdAt = new Date(),
  actor = createUserPersistenceData({}),
  vehicleApplication = createVehicleApplicationPersistenceData({})
}: Partial<IVehicleApplicationAuditLogRawObject>): IVehicleApplicationAuditLogRawObject => {
  return {
    id,
    actorId,
    auditLogType,
    vehicleApplicationId,
    details,
    createdAt,
    actor,
    vehicleApplication
  };
};
