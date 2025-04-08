import { UserSignInActivityFactory } from "../domain/models/userSignInActivity/factory";
import type { IUserSignInActivityRepository } from "../repositories/userSignInActivityRepository";
import { NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import type { IUserSignInActivityDTO } from "../dtos/userSignInActivityDTO";

export interface IUserSignInActivityService {
  createAndSaveUserSignInActivity(userId: string): Promise<void>;
  getRecentActivities(userId: string, limit: number): Promise<IUserSignInActivityDTO[]>;
}

export class UserSignInActivityService implements IUserSignInActivityService {
  private _repository: IUserSignInActivityRepository;

  constructor(repository: IUserSignInActivityRepository) {
    this._repository = repository;
  }

  public async createAndSaveUserSignInActivity(userId: string): Promise<void> {
    const activityOrError = UserSignInActivityFactory.create({
      userId,
      time: new Date()
    });

    if (activityOrError.isFailure) {
      throw new UnexpectedError("Failed to create user sign-in activity");
    }

    try {
      await this._repository.create(activityOrError.getValue());
    } catch (error) {
      if (error instanceof Error && error.message.includes("Foreign key constraint")) {
        throw new NotFoundError("User not found");
      }
      throw new UnexpectedError("Failed to create user sign-in activity");
    }
  }

  public async getRecentActivities(
    userId: string,
    limit: number
  ): Promise<IUserSignInActivityDTO[]> {
    const activities = await this._repository.getRecentByUserId(userId, limit, { user: true });
    return activities.map((activity) => ({
      id: activity.id,
      userId: activity.userId,
      time: activity.time,
      user: activity.user ?? null
    }));
  }
}
