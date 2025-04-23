import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IUser } from "../../../src/domain/models/user/classes/user";
import { type IUserRepository, UserRepository } from "../../../src/repositories/userRepository";
import { createUserDomainObject } from "../../utils/user/createUserDomainObject";
import { seedUser } from "../../utils/user/seedUser";

const assertUser = (user: IUser, expectedUserValue: IUser) => {
  expect(user.id).toBe(expectedUserValue.id);
  expect(user.username.value).toBe(expectedUserValue.username.value);
  expect(user.firstName).toBe(expectedUserValue.firstName);
  expect(user.lastName).toBe(expectedUserValue.lastName);
  expect(user.email.value).toBe(expectedUserValue.email.value);
  expect(user.password).toBe(expectedUserValue.password);
  expect(user.role.value).toBe(expectedUserValue.role.value);
  expect(user.isSuperAdmin).toBe(expectedUserValue.isSuperAdmin);
  expect(user.createdAt.toString()).toBe(expectedUserValue.createdAt.toString());
  expect(user.updatedAt.toString()).toBe(expectedUserValue.updatedAt.toString());
};

describe("UserRepository.updateUser", () => {
  let userRepository: IUserRepository;

  beforeAll(async () => {
    userRepository = new UserRepository();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should update user properties", async () => {
    const seededUser = await seedUser({});
    const domainUser = createUserDomainObject({ id: seededUser.id });
    const updatedUser = await userRepository.updateUser(domainUser);

    expect(updatedUser).not.toBeNull();
    assertUser(updatedUser!, domainUser);
  });

  it("should return null when trying to update non-existing user", async () => {
    const userDomainObject = createUserDomainObject({});
    const user = await userRepository.updateUser(userDomainObject);

    expect(user).toBeNull();
  });
});
