import { v4 as uuid } from "uuid";
import type { IUserViolation } from "../../../src/domain/models/userViolation/classes/userViolation";
import type { IUserViolationRawObject } from "../../../src/domain/models/userViolation/constant";
import { UserViolationFactory } from "../../../src/domain/models/userViolation/factory";
import { faker } from "@faker-js/faker";

export const createUserViolationDomainObject = ({
  id = uuid(),
  userId = uuid(),
  reportedById = uuid(),
  violationId = uuid(),
  vehicleId = uuid(),
  status = "UNPAID", 
  reporter = {
    id: uuid(),
    username: faker.person.fullName(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
  },
  violation = {
    id: uuid(),
    category: faker.helpers.arrayElement(["A", "B", "C"]),
    violationName: faker.lorem.words(3),
    penalty: faker.number.int({ min: 100, max: 1000 }),
  },
  vehicle = {
    id: uuid(),
    ownerId: uuid(),
    licensePlate: faker.vehicle.vrm().toUpperCase(),
    make: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    series: faker.vehicle.type(),
    color: faker.color.human(),
    type: faker.helpers.arrayElement(["Car", "Motorcycle"]),
    images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.image.url()),
    stickerNumber: faker.string.alphanumeric(8).toUpperCase(),
    isActive: faker.datatype.boolean(),
    owner: {
      id: uuid(),
      username: faker.person.fullName(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
    },
  }
}: Partial<IUserViolationRawObject>): IUserViolation => {
  const userViolationOrError = UserViolationFactory.create({
    id,
    userId,
    reportedById,
    violationId,
    vehicleId,
    status, 
    reporter,
    violation,
    vehicle
  });

  return userViolationOrError.getValue();
};
