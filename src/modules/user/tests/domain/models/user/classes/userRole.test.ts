import { UserRole } from "../../../../../src/domain/models/user/classes/userRole";

describe("UserRole", () => {
  it("should match a valid role 'ADMIN'", () => {
    const validRole = "ADMIN";
    const userRoleOrFailure = UserRole.create(validRole);

    expect(userRoleOrFailure.isSuccess).toBe(true);
    expect(userRoleOrFailure.getValue()).toBeInstanceOf(UserRole);
    expect(userRoleOrFailure.getValue().value).toBe(validRole);
  });

  it("should match a valid role 'STAFF'", () => {
    const validRole = "STAFF";
    const userRoleOrFailure = UserRole.create(validRole);

    expect(userRoleOrFailure.isSuccess).toBe(true);
    expect(userRoleOrFailure.getValue()).toBeInstanceOf(UserRole);
    expect(userRoleOrFailure.getValue().value).toBe(validRole);
  });

  it("should match a valid role 'STUDENT'", () => {
    const validRole = "STUDENT";
    const userRoleOrFailure = UserRole.create(validRole);

    expect(userRoleOrFailure.isSuccess).toBe(true);
    expect(userRoleOrFailure.getValue()).toBeInstanceOf(UserRole);
    expect(userRoleOrFailure.getValue().value).toBe(validRole);
  });

  it("should match a valid role 'SECURITY'", () => {
    const validRole = "SECURITY";
    const userRoleOrFailure = UserRole.create(validRole);

    expect(userRoleOrFailure.isSuccess).toBe(true);
    expect(userRoleOrFailure.getValue()).toBeInstanceOf(UserRole);
    expect(userRoleOrFailure.getValue().value).toBe(validRole);
  });

  /**
   * it("should match a valid role 'CASHIER'", () => {
   *     const validRole = "CASHIER";
   *     const userRoleOrFailure = UserRole.create(validRole);
   *
   *     expect(userRoleOrFailure.isSuccess).toBe(true);
   *     expect(userRoleOrFailure.getValue()).toBeInstanceOf(UserRole);
   *     expect(userRoleOrFailure.getValue().value).toBe(validRole);
   *   });
   */

  it("should not match an invalid role", () => {
    const invalidRole = "MANAGER";
    const userRoleOrFailure = UserRole.create(invalidRole);

    expect(userRoleOrFailure.isSuccess).toBe(false);
    expect(userRoleOrFailure.getErrorMessage()).toContain(
      `Invalid user role. Valid roles are ${UserRole.validRoles.join(", ")}`
    );
  });

  it("should not match an invalid role (empty string)", () => {
    const invalidRole = "";
    const userRoleOrFailure = UserRole.create(invalidRole);

    expect(userRoleOrFailure.isSuccess).toBe(false);
    expect(userRoleOrFailure.getErrorMessage()).toContain(
      `Invalid user role. Valid roles are ${UserRole.validRoles.join(", ")}`
    );
  });

  it("should not match an invalid role (mixed case)", () => {
    const invalidRole = "admin";
    const userRoleOrFailure = UserRole.create(invalidRole);

    expect(userRoleOrFailure.isSuccess).toBe(false);
    expect(userRoleOrFailure.getErrorMessage()).toContain(
      `Invalid user role. Valid roles are ${UserRole.validRoles.join(", ")}`
    );
  });
});
