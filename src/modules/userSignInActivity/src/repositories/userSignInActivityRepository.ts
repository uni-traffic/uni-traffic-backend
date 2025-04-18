import { Prisma, type PrismaClient } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type {
  IUserSignInActivity,
  UserSignInActivity
} from "../domain/models/userSignInActivity/classes/userSignInActivity";
import { UserSignInActivityMapper } from "../domain/models/userSignInActivity/mapper";
import type {
  GetTotalUniqueSignInByGivenRangeParams,
  GetUserSignInActivityByRange,
  TotalUniqueSignInByGivenRange
} from "../dtos/userSignInActivityDTO";

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
  getTotalUniqueSignInByGivenRange(
    params: GetTotalUniqueSignInByGivenRangeParams
  ): Promise<TotalUniqueSignInByGivenRange>;
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

  public async getTotalUniqueSignInByGivenRange({
    startDate,
    endDate,
    type
  }: GetTotalUniqueSignInByGivenRangeParams): Promise<TotalUniqueSignInByGivenRange> {
    try {
      const format = type === "MONTH" ? "YYYY-MM" : "YYYY";
      const query =
        type === "DAY"
          ? Prisma.sql`
              SELECT 
                TO_CHAR(DATE_TRUNC('day', "time"), 'YYYY-MM-DD') AS date,
                COUNT(DISTINCT "userId") AS count
              FROM 
                "UserSignInActivity"
              WHERE 
                "time" BETWEEN ${startDate} AND ${endDate}
              GROUP BY 
                date
              ORDER BY 
                date;
            `
          : Prisma.sql`
              SELECT 
                TO_CHAR(day, ${Prisma.sql`${format}`}) AS date,
                SUM(daily_count) AS count
              FROM (
                SELECT 
                  DATE_TRUNC('day', "time") AS day,
                  COUNT(DISTINCT "userId") AS daily_count
                FROM 
                  "UserSignInActivity"
                WHERE 
                  "time" BETWEEN ${startDate} AND ${endDate}
                GROUP BY 
                  day
              ) AS daily_counts
              GROUP BY 
                date
              ORDER BY 
                date;
            `;
      const results = await this._database.$queryRaw<{ date: string; count: number }[]>(query);

      return results.map((result) => {
        return {
          date: result.date,
          count: Number(result.count)
        };
      });
    } catch {
      return [];
    }
  }
}
