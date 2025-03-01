import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";

const seedViolation = async ({
  id = faker.string.uuid(),
  category = faker.helpers.arrayElement(["A", "B", "C"]), 
  violationName = faker.lorem.words(3),
  penalty = faker.number.float({ min: 100, max: 1000 })
} = {}) => {
  return db.violation.create({
    data: {
      id,
      category,
      violationName,
      penalty
    }
  });
};
export { seedViolation };