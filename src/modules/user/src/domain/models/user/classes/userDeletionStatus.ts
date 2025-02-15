import { Result } from "../../../../../../../shared/core/result";

export interface IUserDeletionStatus {
  isDeleted: boolean;
  deletedAt: Date | null;
}

export class UserDeletionStatus implements IUserDeletionStatus {
  private readonly _isDeleted: boolean;
  private readonly _deletedAt: Date | null;

  private constructor(isDeleted: boolean, deletedAt: Date | null = null) {
    this._isDeleted = isDeleted;
    this._deletedAt = deletedAt;
  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  public get deletedAt(): Date | null {
    return this._deletedAt;
  }

  public get value(): IUserDeletionStatus {
    return {
      isDeleted: this._isDeleted,
      deletedAt: this._deletedAt
    };
  }

  public static create(isDeleted: boolean, deletedAt: Date | null): Result<UserDeletionStatus> {
    if ((isDeleted && !deletedAt) || (!isDeleted && deletedAt)) {
      return Result.fail("Deleted users must have a deletedAt timestamp.");
    }

    return Result.ok(new UserDeletionStatus(isDeleted, deletedAt));
  }
}
