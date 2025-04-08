import { UserSignInActivityFactory } from "../domain/models/userSignInActivity/factory";
import type { IUserSignInActivityRepository } from "../repositories/userSignInActivityRepository";
import type { IUserSignInActivityDTO } from "../dtos/userSignInActivityDTO";
import { UnexpectedError } from "../../../../shared/core/errors";

export interface IUserSignInActivityService {
  createAndSaveUserSignInActivity(userId: string): Promise<IUserSignInActivityDTO>;
}

export class UserSignInActivityService implements IUserSignInActivityService {
  private _repository: IUserSignInActivityRepository;

  constructor(repository: IUserSignInActivityRepository) {
    this._repository = repository;
  }

  public async createAndSaveUserSignInActivity(userId: string): Promise<IUserSignInActivityDTO> {
    const activityOrError = UserSignInActivityFactory.create({
      userId,
      time: new Date()
    });

    if (activityOrError.isFailure) {
      throw new UnexpectedError(activityOrError.getErrorMessage()!);
    }

    const created = await this._repository.create(activityOrError.getValue());
    if (!created) {
      throw new UnexpectedError("Failed to save user sign-in activity.");
    }

    return {
      id: created.id,
      userId: created.userId,
      time: created.time,
      user: created.user ?? null
    };
  }
}
