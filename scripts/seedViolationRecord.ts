import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { seedUser } from "../src/modules/user/tests/utils/user/seedUser";
import { seedVehicle } from "../src/modules/vehicle/tests/utils/vehicle/seedVehicle";
import { createViolationPersistenceData } from "../src/modules/violation/tests/utils/violation/createViolationPersistenceData";
const db = new PrismaClient();

export const seedViolationRecords = async () => {
  const user = await seedUser({});
  const reporter = await seedUser({});
  const vehicle = await seedVehicle({});
  const violation = await db.violation.create({
    data: createViolationPersistenceData({})
  });

  if (!user || !reporter || !vehicle || !violation) {
    return;
  }

  const violationRecord = await db.violationRecord.create({
    data: {
      id: uuid(),
      violationId: violation.id,
      vehicleId: vehicle.id,
      userId: user.id,
      reportedById: reporter.id,
      status: faker.helpers.arrayElement(["UNPAID", "PAID"])
    },
    include: {
      reporter: true,
      user: true,
      vehicle: {
        include: {
          owner: true
        }
      },
      violation: true
    }
  });

  return violationRecord;
};

if (require.main === module) {
  seedViolationRecords()
    .catch((error) => console.error("❌ Seeder failed:", error))
    .finally(() => db.$disconnect());
}
