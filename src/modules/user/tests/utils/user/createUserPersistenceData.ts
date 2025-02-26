import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import type { IUserRawObject } from "../../../src/domain/models/user/constant";

export const createUserPersistenceData = ({
  id = uuid(),
  username = faker.word.sample({
    length: {
      min: 3,
      max: 15
    }
  }),
  firstName = faker.person.firstName(),
  lastName = faker.person.lastName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
  role = faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
  isSuperAdmin = false,
  isDeleted = false,
  deletedAt = isDeleted ? new Date() : null,
  createdAt = new Date(),
  updatedAt = new Date()
}: Partial<IUserRawObject>): IUserRawObject => {
  return {
    id,
    username,
    firstName,
    lastName,
    email,
    password,
    isSuperAdmin,
    role,
    isDeleted,
    deletedAt,
    createdAt,
    updatedAt
  };
};
