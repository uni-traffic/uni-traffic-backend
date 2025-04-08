import type {
  IUserSignInActivity,
  UserSignInActivity
} from "../domain/models/userSignInActivity/classes/userSignInActivity";
import { UserSignInActivityMapper } from "../domain/models/userSignInActivity/mapper";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { NotFoundError } from "../../../../shared/core/errors";

interface HydrateOptions {
  user?: boolean;
}

export interface IUserSignInActivityRepository {
  create(activity: IUserSignInActivity): Promise<IUserSignInActivity | null>;
  getByUserId(userId: string, hydrate?: HydrateOptions): Promise<IUserSignInActivity[]>;
  getRecentByUserId(
    userId: string,
    limit: number,
    hydrate?: HydrateOptions
  ): Promise<IUserSignInActivity[]>;
}

export class UserSignInActivityRepository implements IUserSignInActivityRepository {
  private _mapper: UserSignInActivityMapper;

  constructor(mapper = new UserSignInActivityMapper()) {
    this._mapper = mapper;
  }

  public async create(activity: IUserSignInActivity): Promise<IUserSignInActivity | null> {
    try {
      const persistenceData = this._mapper.toPersistence(activity);

      const created = await db.userSignInActivity.create({
        data: persistenceData,
        include: { user: true }
      });

      return this._mapper.toDomain(created);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Foreign key constraint")) {
        throw new NotFoundError("User not found");
      }

      return null;
    }
  }

  public async getByUserId(
    userId: string,
    hydrate?: HydrateOptions
  ): Promise<UserSignInActivity[]> {
    const activities = await db.userSignInActivity.findMany({
      where: { userId },
      orderBy: { time: "desc" },
      include: { user: hydrate?.user }
    });
    return activities.map((activity) => this._mapper.toDomain(activity));
  }

  public async getRecentByUserId(
    userId: string,
    limit: number,
    hydrate?: HydrateOptions
  ): Promise<UserSignInActivity[]> {
    const activities = await db.userSignInActivity.findMany({
      where: { userId },
      orderBy: { time: "desc" },
      take: limit,
      include: { user: hydrate?.user }
    });
    return activities.map((activity) => this._mapper.toDomain(activity));
  }
}
