import type { ViolationRecordStatus as PrismaViolationRecordStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { defaultTo } from "rambda";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import {
  type IViolationRecordMapper,
  ViolationRecordMapper
} from "../domain/models/violationRecord/mapper";
import type {
  GetTotalViolationGivenByRangeParams,
  GetViolationRecord,
  GetViolationsGivenPerDayByRangeParams,
  UnpaidAndPaidViolationTotal,
  ViolationGivenByRange,
  ViolationRecordWhereClauseParams
} from "../dtos/violationRecordDTO";

export interface IViolationRecordRepository {
  createViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord | null>;
  getViolationRecord(params: GetViolationRecord): Promise<IViolationRecord[]>;
  updateViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord | null>;
  getViolationRecordGivenByRange(
    params: GetViolationsGivenPerDayByRangeParams
  ): Promise<{ id: string; createdAt: Date }[]>;
  getUnpaidAndPaidViolationTotal(): Promise<UnpaidAndPaidViolationTotal>;
  getTotalViolationGivenByRange({
    startDate,
    endDate,
    type
  }: GetTotalViolationGivenByRangeParams): Promise<ViolationGivenByRange>;
  getTotalViolation(params: ViolationRecordWhereClauseParams): Promise<number>;
  getViolationRecordById(violationRecordId: string): Promise<IViolationRecord | null>;
  getViolationRecordByIds(violationRecordId: string[]): Promise<IViolationRecord[]>;
}

export class ViolationRecordRepository implements IViolationRecordRepository {
  private _database;
  private _violationRecordMapper: IViolationRecordMapper;

  public constructor(
    database = db,
    violationRecordMapper: IViolationRecordMapper = new ViolationRecordMapper()
  ) {
    this._database = database;
    this._violationRecordMapper = violationRecordMapper;
  }

  public async createViolationRecord(
    violationRecord: IViolationRecord
  ): Promise<IViolationRecord | null> {
    try {
      const violationRecordPersistence = this._violationRecordMapper.toPersistence(violationRecord);

      const newViolationRecord = await this._database.violationRecord.create({
        data: violationRecordPersistence
      });

      return this._violationRecordMapper.toDomain(newViolationRecord);
    } catch {
      return null;
    }
  }

  public async getViolationRecordById(violationRecordId: string): Promise<IViolationRecord | null> {
    const violation = await this.getViolationRecordByIds([violationRecordId]);

    if (violation.length === 0) {
      return null;
    }

    return violation[0];
  }

  public async getViolationRecordByIds(violationRecordId: string[]): Promise<IViolationRecord[]> {
    const violationRaw = await this._database.violationRecord.findMany({
      where: {
        id: {
          in: violationRecordId
        }
      },
      include: {
        violation: true
      }
    });

    return violationRaw.map((violationRecord) =>
      this._violationRecordMapper.toDomain(violationRecord)
    );
  }

  public async getViolationRecord(params: GetViolationRecord): Promise<IViolationRecord[]> {
    try {
      const violationRecordRaw = await this._database.violationRecord.findMany({
        skip: params.count * (params.page - 1),
        take: params.count,
        where: this._generateWhereClause(params),
        orderBy: {
          createdAt: params.sort === 1 ? "asc" : "desc"
        },
        include: {
          reporter: true,
          user: true,
          vehicle: true,
          violation: true,
          violationRecordPayment: {
            include: {
              cashier: true
            }
          }
        }
      });

      return violationRecordRaw.map((violationRecord) =>
        this._violationRecordMapper.toDomain(violationRecord)
      );
    } catch {
      return [];
    }
  }

  public async getTotalViolation(params: ViolationRecordWhereClauseParams): Promise<number> {
    return this._database.violationRecord.count({
      where: this._generateWhereClause(params)
    });
  }

  private _generateWhereClause(
    params: ViolationRecordWhereClauseParams
  ): Prisma.ViolationRecordWhereInput {
    return params.searchKey
      ? {
          OR: [
            { id: { contains: params.searchKey, mode: "insensitive" } },
            { userId: { contains: params.searchKey, mode: "insensitive" } },
            { vehicleId: { contains: params.searchKey, mode: "insensitive" } },
            { reportedById: { contains: params.searchKey, mode: "insensitive" } }
          ],
          status: params.status as PrismaViolationRecordStatus
        }
      : {
          id: params.id,
          userId: params.userId,
          vehicleId: params.vehicleId,
          reportedById: params.reportedById,
          status: params.status as PrismaViolationRecordStatus
        };
  }

  public async updateViolationRecord(
    violationRecord: IViolationRecord
  ): Promise<IViolationRecord | null> {
    try {
      const violationPersistence = this._violationRecordMapper.toPersistence(violationRecord);
      const updatedViolationRecord = await this._database.violationRecord.update({
        where: { id: violationRecord.id },
        data: violationPersistence
      });

      return this._violationRecordMapper.toDomain(updatedViolationRecord);
    } catch {
      return null;
    }
  }

  public async getViolationRecordGivenByRange(
    params: GetViolationsGivenPerDayByRangeParams
  ): Promise<{ id: string; createdAt: Date }[]> {
    try {
      return await this._database.violationRecord.findMany({
        where: {
          createdAt: {
            gte: params.startDate,
            lte: params.endDate
          }
        },
        select: {
          id: true,
          createdAt: true
        },
        orderBy: {
          createdAt: "asc"
        }
      });
    } catch {
      return [];
    }
  }

  public async getUnpaidAndPaidViolationTotal(): Promise<UnpaidAndPaidViolationTotal> {
    try {
      const result = await this._database.$queryRaw<
        { unpaidTotal: number | null; paidTotal: number | null }[]
      >(Prisma.sql`
      SELECT 
        SUM(CASE WHEN vr."status" = 'PAID' THEN vr."penalty" ELSE 0 END) AS "paidTotal",
        SUM(CASE WHEN vr."status" = 'UNPAID' THEN vr."penalty" ELSE 0 END) AS "unpaidTotal"
      FROM "ViolationRecord" vr
    `);

      return {
        unpaidTotal: defaultTo(0, result[0].unpaidTotal),
        paidTotal: defaultTo(0, result[0].paidTotal)
      };
    } catch {
      return {
        unpaidTotal: 0,
        paidTotal: 0
      };
    }
  }

  public async getTotalViolationGivenByRange({
    startDate,
    endDate,
    type
  }: GetTotalViolationGivenByRangeParams): Promise<ViolationGivenByRange> {
    try {
      const formattedDateSql = this._getFormattedDate(type);
      const results = await this._database.$queryRaw<{ date: string; count: number }[]>(
        Prisma.sql`
          SELECT 
            ${formattedDateSql} AS date,
            COUNT(*) AS "count"
          FROM "ViolationRecord"
          WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
          GROUP BY ${formattedDateSql}
          ORDER BY date
        `
      );

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

  private _getFormattedDate(type: "YEAR" | "MONTH" | "DAY"): Prisma.Sql {
    switch (type) {
      case "DAY":
        return Prisma.sql`TO_CHAR("createdAt", 'YYYY-MM-DD')`;
      case "MONTH":
        return Prisma.sql`TO_CHAR("createdAt", 'YYYY-MM')`;
      case "YEAR":
        return Prisma.sql`TO_CHAR("createdAt", 'YYYY')`;
    }
  }
}
