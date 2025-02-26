import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IViolation } from "../../../src/domain/models/violation/classes/violation";
import type { IViolationRawObject } from "../../../src/domain/models/violation/constant";
import { ViolationFactory } from "../../../src/domain/models/violation/factory";

export const createViolationDomainObject = ({
  id = uuid(),
  category = faker.helpers.arrayElement(["A", "B", "C"]),
  violationName = faker.lorem.words(3),
  penalty = faker.helpers.arrayElement([250, 500, 1000])
}: Partial<IViolationRawObject>): IViolation => {
  const violationOrError = ViolationFactory.create({
    id,
    category,
    violationName,
    penalty
  });

  return violationOrError.getValue();
};
