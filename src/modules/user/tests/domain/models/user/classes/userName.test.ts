import { UserName } from "../../../../../src/domain/models/user/classes/userName";

describe("UserName", () => {
  it("should create a UserName instance when valid", () => {
    const result = UserName.create("French Anthony");

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(UserName);
    expect(result.getValue().value).toBe("French Anthony");
  });

  it("should fail if username exceeds maximum characters", () => {
    const longName = "a".repeat(16);
    const result = UserName.create(longName);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(
      `Username is limited to ${UserName.MAXIMUM_USERNAME_LENGTH} characters long`
    );
  });
});
