import { faker } from "@faker-js/faker";
import type { ViolationRecordStatus as ViolationRecordSchema } from "@prisma/client";
import { defaultTo } from "rambda";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { uniTrafficId } from "../../../../../shared/lib/uniTrafficId";
import type { IUserRawObject } from "../../../../user/src/domain/models/user/constant";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import type { IVehicleRawObject } from "../../../../vehicle/src/domain/models/vehicle/constant";
import { seedVehicle } from "../../../../vehicle/tests/utils/vehicle/seedVehicle";
import type { IViolationRawObject } from "../../../../violation/src/domain/models/violation/constant";
import { seedViolation } from "../../../../violation/tests/utils/violation/seedViolation";
import { seedViolationRecordPayment } from "../../../../violationRecordPayment/tests/utils/violationRecordPayment/seedViolationRecordPayment";
import type { IViolationRecordFactoryProps } from "../../../src/domain/models/violationRecord/factory";

export const seedViolationRecord = async ({
  id = uniTrafficId(),
  userId,
  reportedById,
  violationId,
  vehicleId,
  penalty = faker.helpers.arrayElement([250, 500, 1000]),
  status = faker.helpers.arrayElement(["UNPAID", "PAID"]),
  createdAt
}: Partial<IViolationRecordFactoryProps> & {
  owner?: Partial<IUserRawObject>;
  reporter?: Partial<IUserRawObject>;
  violation?: Partial<IViolationRawObject>;
  vehicle?: Partial<IVehicleRawObject>;
  createdAt?: Date;
}) => {
  const violation =
    violationId !== undefined
      ? await db.violation.findUniqueOrThrow({
          where: {
            id: violationId
          }
        })
      : await seedViolation({ penalty: penalty });

  const result = await db.violationRecord.create({
    data: {
      id,
      remarks: faker.lorem.sentence({ min: 1, max: 15 }),
      vehicleId: defaultTo((await seedVehicle({})).id, vehicleId),
      violationId: defaultTo(violation.id, violationId),
      userId: defaultTo(
        (await seedUser({ role: faker.helpers.arrayElement(["STUDENT", "STAFF"]) })).id,
        userId
      ),
      reportedById: defaultTo((await seedUser({ role: "SECURITY" })).id, reportedById),
      penalty: violation.penalty,
      status: status as ViolationRecordSchema,
      createdAt: createdAt ?? new Date()
    },
    include: {
      reporter: true,
      user: true,
      vehicle: true,
      violation: true
    }
  });

  if (status === "PAID") {
    await seedViolationRecordPayment({
      violationRecordId: id,
      amountDue: result.penalty
    });
  }

  return result;
};
