import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";
import type { IVehicleAuditLogRawObject } from "../../src/domain/models/vehicleAuditLog/constant";
import type { IVehicleAuditLog } from "../../src/domain/models/vehicleAuditLog/classes/vehicleAuditLog";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";
import { createVehiclePersistenceData } from "../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";
import { VehicleAuditLogFactory } from "../../src/domain/models/vehicleAuditLog/factory";

export const createVehicleAuditLogDomainObject = ({
  id = uuid(),
  actorId = uuid(),
  auditLogType = faker.helpers.arrayElement(["CREATE", "UPDATE", "DELETE"]),
  vehicleId = uuid(),
  details = faker.lorem.words(),
  createdAt = new Date(),
  actor = createUserPersistenceData({}),
  vehicle = createVehiclePersistenceData({})
}: Partial<IVehicleAuditLogRawObject>): IVehicleAuditLog => {
  const vehicleAuditLogOrError = VehicleAuditLogFactory.create({
    id,
    actorId,
    auditLogType,
    vehicleId,
    details,
    createdAt,
    actor,
    vehicle
  });

  if (vehicleAuditLogOrError.isFailure) {
    throw new Error(vehicleAuditLogOrError.getErrorMessage()!);
  }

  return vehicleAuditLogOrError.getValue();
};
