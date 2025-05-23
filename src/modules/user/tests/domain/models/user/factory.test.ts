import { faker } from "@faker-js/faker";
import { User } from "../../../../src/domain/models/user/classes/user";
import { UserName } from "../../../../src/domain/models/user/classes/userName";
import { type IUserFactoryProps, UserFactory } from "../../../../src/domain/models/user/factory";

describe("UserFactory", () => {
  let mockUserData: IUserFactoryProps;

  beforeEach(() => {
    mockUserData = {
      id: faker.string.uuid(),
      username: faker.word.sample({ length: 15 }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"]),
      isSuperAdmin: false,
      isDeleted: false,
      deletedAt: null,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    };
  });

  it("should successfully create a User when all properties are valid", () => {
    const result = UserFactory.create(mockUserData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(User);

    const user = result.getValue();
    expect(user.id).toBe(mockUserData.id);
    expect(user.username.value).toBe(mockUserData.username);
    expect(user.firstName).toBe(mockUserData.firstName);
    expect(user.lastName).toBe(mockUserData.lastName);
    expect(user.email.value).toBe(mockUserData.email);
    expect(user.password).toBe(mockUserData.password);
    expect(user.role.value).toBe(mockUserData.role);
    expect(user.isSuperAdmin).toBe(mockUserData.isSuperAdmin);
    expect(user.createdAt).toBe(mockUserData.createdAt);
    expect(user.updatedAt).toBe(mockUserData.updatedAt);
  });

  it("should fail to create a User when email format is invalid", () => {
    mockUserData.email = faker.string.alpha({ length: 10 });

    const result = UserFactory.create(mockUserData);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(`${mockUserData.email} is not a valid email address`);
  });

  it("should fail to create a User when username exceeds the character limit", () => {
    mockUserData.username = "a".repeat(UserName.MAXIMUM_USERNAME_LENGTH + 1);

    const result = UserFactory.create(mockUserData);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(
      `Username is limited to ${UserName.MAXIMUM_USERNAME_LENGTH} characters long`
    );
  });
});
