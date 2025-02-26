import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IViolationRawObject } from "../../../src/domain/models/violation/constant";

export const createViolationPersistenceData = ({
  id = uuid(),
  category = faker.helpers.arrayElement(["A", "B", "C"]),
  violationName = faker.lorem.words(3),
  penalty = faker.helpers.arrayElement([250, 500, 1000])
}: Partial<IViolationRawObject>): IViolationRawObject => {
  return {
    id,
    category,
    violationName,
    penalty
  };
};
