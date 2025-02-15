import { Result } from "../../../../../../../shared/core/result";

export class UserEmail {
  private readonly _value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Result<UserEmail> {
    if (!UserEmail._isValidEmail(value)) {
      return Result.fail<UserEmail>(`${value} is not a valid email address`);
    }

    return Result.ok<UserEmail>(new UserEmail(value));
  }

  public get value(): string {
    return this._value;
  }

  private static _isValidEmail(value: string): boolean {
    return UserEmail.EMAIL_REGEX.test(value);
  }
}
