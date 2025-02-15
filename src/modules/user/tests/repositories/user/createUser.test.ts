import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IUser } from "../../../src/domain/models/user/classes/user";
import { type IUserRepository, UserRepository } from "../../../src/repositories/userRepository";
import { createUserDomainObject } from "../../utils/user/createUserDomainObject";

const assertUser = (user: IUser, expectedUserValue: IUser) => {
  expect(user.id).toBe(expectedUserValue.id);
  expect(user.usernameValue).toBe(expectedUserValue.usernameValue);
  expect(user.firstName).toBe(expectedUserValue.firstName);
  expect(user.lastName).toBe(expectedUserValue.lastName);
  expect(user.emailValue).toBe(expectedUserValue.emailValue);
  expect(user.password).toBe(expectedUserValue.password);
  expect(user.role).toBe(expectedUserValue.role);
  expect(user.isSuperAdmin).toBe(expectedUserValue.isSuperAdmin);
  expect(user.createdAt.toString()).toBe(expectedUserValue.createdAt.toString());
  expect(user.updatedAt.toString()).toBe(expectedUserValue.updatedAt.toString());
};

describe("UserRepository.createUser", () => {
  let userRepository: IUserRepository;

  beforeAll(async () => {
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should create user successfully", async () => {
    const userDomainObject = createUserDomainObject({});

    const createdUser = await userRepository.createUser(userDomainObject);

    assertUser(createdUser!, userDomainObject);
  });
});
