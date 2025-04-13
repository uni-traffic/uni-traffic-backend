import type { PrismaClient } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type {
  IUserSignInActivity,
  UserSignInActivity
} from "../domain/models/userSignInActivity/classes/userSignInActivity";
import { UserSignInActivityMapper } from "../domain/models/userSignInActivity/mapper";
import type { GetUserSignInActivityByRange } from "../dtos/userSignInActivityDTO";

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
  countUserSignInActivityByRange(params: GetUserSignInActivityByRange): Promise<number>;
}

export class UserSignInActivityRepository implements IUserSignInActivityRepository {
  private _mapper: UserSignInActivityMapper;
  private _database: PrismaClient;

  constructor(database = db, mapper = new UserSignInActivityMapper()) {
    this._database = database;
    this._mapper = mapper;
  }

  public async create(activity: IUserSignInActivity): Promise<IUserSignInActivity | null> {
    try {
      const persistenceData = this._mapper.toPersistence(activity);
      const savedUserRaw = await db.userSignInActivity.create({
        data: persistenceData,
        include: { user: true }
      });

      return this._mapper.toDomain(savedUserRaw);
    } catch {
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

  public async countUserSignInActivityByRange(
    params: GetUserSignInActivityByRange
  ): Promise<number> {
    try {
      const uniqueUsers = await this._database.userSignInActivity.findMany({
        where: {
          time: {
            gte: params.startDate,
            lte: params.endDate
          }
        },
        distinct: ["userId"],
        select: {
          userId: true,
          time: true
        }
      });

      return uniqueUsers.length;
    } catch {
      return 0;
    }
  }
}
