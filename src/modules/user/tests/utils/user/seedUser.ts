import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { BycryptPassword } from "../../../../../shared/lib/bycrypt";
import type { IUserRawObject } from "../../../src/domain/models/user/constant";

export const seedUser = async ({
  id = uuid(),
  username = faker.number.int({ min: 100, max: 99_999_99 }).toString(),
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
}: Partial<IUserRawObject>): Promise<IUserRawObject> => {
  const bycryptPassword = new BycryptPassword();
  const hashedPassword = await bycryptPassword.generateHash(password);

  return db.user.create({
    data: {
      id,
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isSuperAdmin,
      role,
      isDeleted,
      deletedAt,
      createdAt,
      updatedAt
    }
  });
};
