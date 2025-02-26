import { Role } from "@prisma/client";
import { Result } from "../../../../../../../shared/core/result";

export class UserRole {
  private readonly _value: string;
  public static readonly validRoles = Object.values<string>(Role);

  private constructor(value: string) {
    this._value = value;
  }

  public static create(role: string): Result<UserRole> {
    if (!UserRole.validRoles.includes(role)) {
      return Result.fail<UserRole>(
        `Invalid user role. Valid roles are ${UserRole.validRoles.join(", ")}`
      );
    }

    return Result.ok(new UserRole(role));
  }

  public get value(): string {
    return this._value;
  }
}
