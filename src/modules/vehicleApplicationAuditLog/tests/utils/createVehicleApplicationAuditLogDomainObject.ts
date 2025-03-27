import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";
import type { IVehicleApplicationAuditLogRawObject } from "../../src/domain/models/vehicleApplicationAuditLog/constant";
import type { IVehicleApplicationAuditLog } from "../../src/domain/models/vehicleApplicationAuditLog/classes/vehicleApplicationAuditLog";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { createVehicleApplicationPersistenceData } from "../../../vehicleApplication/tests/utils/createVehiclePersistenceData";
import { VehicleApplicationAuditLogFactory } from "../../src/domain/models/vehicleApplicationAuditLog/factory";

export const createVehicleApplicationAuditLogDomainObject = ({
  id = uuid(),
  actorId = uuid(),
  auditLogType = faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"]),
  vehicleApplicationId = uuid(),
  details = faker.lorem.words(),
  createdAt = new Date(),
  actor = createUserPersistenceData({}),
  vehicleApplication = createVehicleApplicationPersistenceData({})
}: Partial<IVehicleApplicationAuditLogRawObject>): IVehicleApplicationAuditLog => {
  const vehicleApplicationAuditLogOrError = VehicleApplicationAuditLogFactory.create({
    id,
    actorId,
    auditLogType,
    vehicleApplicationId,
    details,
    createdAt,
    actor,
    vehicleApplication
  });

  if (vehicleApplicationAuditLogOrError.isFailure) {
    throw new Error(vehicleApplicationAuditLogOrError.getErrorMessage()!);
  }

  return vehicleApplicationAuditLogOrError.getValue();
};
