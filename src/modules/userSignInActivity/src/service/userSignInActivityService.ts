import { UnexpectedError } from "../../../../shared/core/errors";
import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import { type IUserService, UserService } from "../../../user/src/shared/service/userService";
import { UserSignInActivityFactory } from "../domain/models/userSignInActivity/factory";
import type { IUserSignInActivityDTO } from "../dtos/userSignInActivityDTO";
import {
  type IUserSignInActivityRepository,
  UserSignInActivityRepository
} from "../repositories/userSignInActivityRepository";

export interface IUserSignInActivityService {
  createAndSaveUserSignInActivity(userId: string): Promise<IUserSignInActivityDTO>;
}

export class UserSignInActivityService implements IUserSignInActivityService {
  private _repository: IUserSignInActivityRepository;
  private _userService: IUserService;

  constructor(
    repository: IUserSignInActivityRepository = new UserSignInActivityRepository(),
    userService: IUserService = new UserService()
  ) {
    this._repository = repository;
    this._userService = userService;
  }

  public async createAndSaveUserSignInActivity(userId: string): Promise<IUserSignInActivityDTO> {
    await this._ensureUserExist(userId);

    const activityOrError = UserSignInActivityFactory.create({
      userId
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

  private async _ensureUserExist(userId: string): Promise<IUserDTO> {
    return this._userService.getUserById(userId);
  }
}
