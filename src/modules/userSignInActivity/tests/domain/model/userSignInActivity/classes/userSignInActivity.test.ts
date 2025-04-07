import { faker } from "@faker-js/faker";
import {
  IUserSignInActivity,
  UserSignInActivity,
} from "../../../../../src/domain/models/userSignInActivity/classes/userSignInActivity";

describe("UserSignInActivity", () => {
  it("should create a UserSignInActivity", () => {
    const mockUserSignInActivity: IUserSignInActivity = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      time: new Date(),
      user: null,
    };

    const userSignInActivity = UserSignInActivity.create(mockUserSignInActivity);

    expect(userSignInActivity).toBeInstanceOf(UserSignInActivity);
    expect(userSignInActivity.id).toBe(mockUserSignInActivity.id);
    expect(userSignInActivity.userId).toBe(mockUserSignInActivity.userId);
    expect(userSignInActivity.time).toBe(mockUserSignInActivity.time);
    expect(userSignInActivity.user).toBe(mockUserSignInActivity.user);
  });
});
