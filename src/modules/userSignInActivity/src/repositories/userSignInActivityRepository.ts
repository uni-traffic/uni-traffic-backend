import type { UserSignInActivity } from "../domain/models/userSignInActivity/classes/userSignInActivity";
import { UserSignInActivityMapper } from "../domain/models/userSignInActivity/mapper";
import { db } from "../../../../shared/infrastructure/database/prisma";

interface HydrateOptions {
  user?: boolean;
}

export interface IUserSignInActivityRepository {
  create(activity: UserSignInActivity): Promise<UserSignInActivity>;
  getByUserId(userId: string, hydrate?: HydrateOptions): Promise<UserSignInActivity[]>;
  getRecentByUserId(
    userId: string,
    limit: number,
    hydrate?: HydrateOptions
  ): Promise<UserSignInActivity[]>;
}

export class UserSignInActivityRepository implements IUserSignInActivityRepository {
  private _mapper: UserSignInActivityMapper;

  constructor(mapper = new UserSignInActivityMapper()) {
    this._mapper = mapper;
  }

  public async create(activity: UserSignInActivity): Promise<UserSignInActivity> {
    const created = await db.userSignInActivity.create({
      data: this._mapper.toPersistence(activity)
    });
    return this._mapper.toDomain({ ...created, user: null });
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
