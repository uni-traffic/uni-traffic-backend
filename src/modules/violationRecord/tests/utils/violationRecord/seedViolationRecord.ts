import { faker } from "@faker-js/faker";
import { defaultTo } from "rambda";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import type { IViolationRecordFactoryProps } from "../../../src/domain/models/violationRecord/factory";
import type { IUserRawObject } from "../../../../user/src/domain/models/user/constant";
import type { IVehicleRawObject } from "../../../../vehicle/src/domain/models/vehicle/constant";
import type { IViolationRawObject } from "../../../../violation/src/domain/models/violation/constant";
import type { ViolationRecordStatus as ViolationRecordSchema } from "@prisma/client";
import { seedVehicle } from "../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../../violation/tests/utils/violation/seedViolation";
import { uniTrafficId } from "../../../../../shared/lib/uniTrafficId";

export const seedViolationRecord = async ({
  id = uniTrafficId(),
  userId,
  reportedById,
  violationId,
  vehicleId,
  status = faker.helpers.arrayElement(["UNPAID", "PAID"])
}: Partial<IViolationRecordFactoryProps> & {
  owner?: Partial<IUserRawObject>;
  reporter?: Partial<IUserRawObject>;
  violation?: Partial<IViolationRawObject>;
  vehicle?: Partial<IVehicleRawObject>;
}) => {
  const seededVehicle = await seedVehicle({});
  const seededViolation = await seedViolation({});
  const seededReporter = await seedUser({ role: "SECURITY" });

  return db.violationRecord.create({
    data: {
      id,
      vehicleId: defaultTo(seededVehicle.id, vehicleId),
      violationId: defaultTo(seededViolation.id, violationId),
      userId: defaultTo(seededVehicle.ownerId, userId),
      reportedById: defaultTo(seededReporter.id, reportedById),
      status: status as ViolationRecordSchema
    },
    include: {
      reporter: true,
      user: true,
      vehicle: true,
      violation: true
    }
  });
};
