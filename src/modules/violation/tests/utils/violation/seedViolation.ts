import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IViolationSchema } from "../../../src/domain/models/violation/constant";

export const seedViolation = async ({
  id = faker.string.uuid(),
  category = faker.helpers.arrayElement(["A", "B", "C"]),
  violationName = faker.lorem.words(3),
  penalty = faker.number.int({ min: 100, max: 1000 })
}: Partial<IViolationSchema>) => {
  return db.violation.create({
    data: {
      id,
      category,
      violationName,
      penalty
    }
  });
};
