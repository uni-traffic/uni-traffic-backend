import { UserSignInActivity } from "../../../../src/domain/models/userSignInActivity/classes/userSignInActivity";
import { UserSignInActivityFactory } from "../../../../src/domain/models/userSignInActivity/factory";
import { createUserSignInActivityPersistenceData } from "../../../utils/createUserSignInActivityPersistenceData";

describe("UserSignInActivityFactory", () => {
  it("should successfully create a UserSignInActivity", () => {
    const mockData = createUserSignInActivityPersistenceData({});
    const result = UserSignInActivityFactory.create(mockData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(UserSignInActivity);
    expect(result.getValue().id).toBe(mockData.id);
    expect(result.getValue().userId).toBe(mockData.userId);
    expect(result.getValue().time).toEqual(mockData.time);
    if (mockData.user) {
      expect(result.getValue().user).toBeDefined();
    } else {
      expect(result.getValue().user).toBeUndefined();
    }
  });
});
