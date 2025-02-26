import { faker } from "@faker-js/faker";
import { User } from "../../../../../src/domain/models/user/classes/user";
import { UserDeletionStatus } from "../../../../../src/domain/models/user/classes/userDeletionStatus";
import { UserEmail } from "../../../../../src/domain/models/user/classes/userEmail";
import { UserName } from "../../../../../src/domain/models/user/classes/userName";
import { UserRole } from "../../../../../src/domain/models/user/classes/userRole";

describe("User", () => {
  it("should create a User", () => {
    const mockUserData: {
      id: string;
      username: UserName;
      firstName: string;
      lastName: string;
      email: UserEmail;
      password: string;
      isSuperAdmin: boolean;
      role: UserRole;
      userDeletionStatus: UserDeletionStatus;
      createdAt: Date;
      updatedAt: Date;
    } = {
      id: faker.string.uuid(),
      username: UserName.create(faker.word.sample({ length: 15 })).getValue(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: UserEmail.create(faker.internet.email()).getValue(),
      password: faker.internet.password(),
      role: UserRole.create(
        faker.helpers.arrayElement(["STUDENT", "SECURITY", "ADMIN", "STAFF"])
      ).getValue(),
      isSuperAdmin: false,
      userDeletionStatus: UserDeletionStatus.create(false, null).getValue(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    };

    const user = User.create(mockUserData);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(mockUserData.id);
    expect(user.firstName).toBe(mockUserData.firstName);
    expect(user.lastName).toBe(mockUserData.lastName);
    expect(user.password).toBe(mockUserData.password);
    expect(user.role).toBe(mockUserData.role);
    expect(user.isSuperAdmin).toBe(mockUserData.isSuperAdmin);
    expect(user.userDeletionStatus.isDeleted.toString()).toBe(
      mockUserData.userDeletionStatus.isDeleted.toString()
    );
    expect(user.createdAt.toString()).toBe(mockUserData.createdAt.toString());
    expect(user.updatedAt.toString()).toBe(mockUserData.updatedAt.toString());
  });
});
