import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IUser } from "../../../src/domain/models/user/classes/user";
import type { IUserRawObject } from "../../../src/domain/models/user/constant";
import { type IUserRepository, UserRepository } from "../../../src/repositories/userRepository";
import { seedUser } from "../../utils/user/seedUser";

const assertUser = (user: IUser, expectedUserValue: IUserRawObject) => {
  expect(user.id).toBe(expectedUserValue.id);
  expect(user.username.value).toBe(expectedUserValue.username);
  expect(user.firstName).toBe(expectedUserValue.firstName);
  expect(user.lastName).toBe(expectedUserValue.lastName);
  expect(user.email.value).toBe(expectedUserValue.email);
  expect(user.password).toBe(expectedUserValue.password);
  expect(user.role.value).toBe(expectedUserValue.role);
  expect(user.isSuperAdmin).toBe(expectedUserValue.isSuperAdmin);
  expect(user.createdAt.toString()).toBe(expectedUserValue.createdAt.toString());
  expect(user.updatedAt.toString()).toBe(expectedUserValue.updatedAt.toString());
};

describe("UserRepository.getUsersByIds", () => {
  let userRepository: IUserRepository;

  beforeAll(async () => {
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should retrieve a users by Id", async () => {
    const seededUserOne = await seedUser({});
    const seededUserTwo = await seedUser({});

    const users = await userRepository.getUsersByIds([seededUserOne.id, seededUserTwo.id]);

    assertUser(users[0], seededUserOne);
    assertUser(users[1], seededUserTwo);
  });

  it("should only retrieve existing users", async () => {
    const seededUserOne = await seedUser({});
    const seededUserTwo = await seedUser({});
    const seededUserIdThree = "non-existing-user-id";

    const users = await userRepository.getUsersByIds([
      seededUserOne.id,
      seededUserTwo.id,
      seededUserIdThree
    ]);

    assertUser(users[0], seededUserOne);
    assertUser(users[1], seededUserTwo);
    expect(users[2]).toBeUndefined();
  });

  it("should return null when given non-existing user id", async () => {
    const users = await userRepository.getUsersByIds(["non-existing-user-id"]);

    expect(users).toEqual([]);
  });
});
