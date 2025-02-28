import { faker } from "@faker-js/faker";
import type { Role } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { BycryptPassword } from "../../../../../shared/lib/bycrypt";
import { JSONWebToken } from "../../../../../shared/lib/jsonWebToken";
import type { IUserRawObject } from "../../../src/domain/models/user/constant";

interface IAuthenticatedUser extends IUserRawObject {
  accessToken: string;
}
interface IAuthenticatedUserProps extends Partial<IUserRawObject> {
  role: Role;
  expiration?: string;
}

export const seedAuthenticatedUser = async ({
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
  role,
  isSuperAdmin = false,
  isDeleted = false,
  deletedAt = isDeleted ? new Date() : null,
  createdAt = new Date(),
  updatedAt = new Date(),
  expiration
}: IAuthenticatedUserProps): Promise<IAuthenticatedUser> => {
  const bycryptPassword = new BycryptPassword();
  const hashedPassword = await bycryptPassword.generateHash(password);

  const jsonWebToken = new JSONWebToken();
  const accessToken = jsonWebToken.sign({ id: id, role: role }, expiration);

  const savedUser = await db.user.create({
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

  return {
    ...savedUser,
    accessToken
  };
};
