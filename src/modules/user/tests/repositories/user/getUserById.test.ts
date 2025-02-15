import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IUser } from "../../../src/domain/models/user/classes/user";
import type { IUserRawObject } from "../../../src/domain/models/user/constant";
import { type IUserRepository, UserRepository } from "../../../src/repositories/userRepository";
import { seedUser } from "../../utils/user/seedUser";

const assertUser = (user: IUser, expectedUserValue: IUserRawObject) => {
  expect(user.id).toBe(expectedUserValue.id);
  expect(user.usernameValue).toBe(expectedUserValue.username);
  expect(user.firstName).toBe(expectedUserValue.firstName);
  expect(user.lastName).toBe(expectedUserValue.lastName);
  expect(user.emailValue).toBe(expectedUserValue.email);
  expect(user.password).toBe(expectedUserValue.password);
  expect(user.role).toBe(expectedUserValue.role);
  expect(user.isSuperAdmin).toBe(expectedUserValue.isSuperAdmin);
  expect(user.createdAt.toString()).toBe(expectedUserValue.createdAt.toString());
  expect(user.updatedAt.toString()).toBe(expectedUserValue.updatedAt.toString());
};

describe("UserRepository.getUserById", () => {
  let userRepository: IUserRepository;

  beforeAll(async () => {
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should retrieve existing user found by Id", async () => {
    const seededUser = await seedUser({});

    const user = await userRepository.getUserById(seededUser.id);

    assertUser(user!, seededUser);
  });

  it("should return null when given non-existing user id", async () => {
    const user = await userRepository.getUserById("not-a-user-id");

    expect(user).toBeNull();
  });
});
