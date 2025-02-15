import { UserEmail } from "../../../../../src/domain/models/user/classes/userEmail";

describe("UserEmail", () => {
  it("should create a UserEmail instance when valid", () => {
    const result = UserEmail.create("test@example.com");

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(UserEmail);
    expect(result.getValue().value).toBe("test@example.com");
  });

  it("should fail if email is invalid", () => {
    const invalidEmail = "invalid-email";
    const result = UserEmail.create(invalidEmail);

    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe(`${invalidEmail} is not a valid email address`);
  });
});
