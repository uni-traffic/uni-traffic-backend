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
  GetViolationRecordByProperty,
  GetViolationsGivenPerDayByRangeParams,
  UnpaidAndPaidViolationTotal,
  ViolationGivenByRange
} from "../dtos/violationRecordDTO";

export interface IViolationRecordRepository {
  createViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord | null>;
  getViolationRecordByProperty(params: GetViolationRecordByProperty): Promise<IViolationRecord[]>;
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

  /** TODO:
   * Implement a search that matches records where:
   * - The given id matches any record containing the provided value in the corresponding property.
   */
  public async getViolationRecordByProperty(
    params: GetViolationRecordByProperty
  ): Promise<IViolationRecord[]> {
    const { id, userId, violationId, reportedById, vehicleId, status, page, count } = params;
    let take: number | undefined = undefined;
    let skip: number | undefined = undefined;
    if (page && count) {
      take = count * page;
      skip = take * (page - 1);
    }

    try {
      const violationRecordRaw = await this._database.violationRecord.findMany({
        take: take,
        skip: skip,
        where: {
          ...{ id: id || undefined },
          ...{ userId: userId || undefined },
          ...{ violationId: violationId || undefined },
          ...{ reportedById: reportedById || undefined },
          ...{ vehicleId: vehicleId || undefined },
          ...{ status: (status as PrismaViolationRecordStatus) || undefined }
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

  public async updateViolationRecord(
    violationRecord: IViolationRecord
  ): Promise<IViolationRecord | null> {
    try {
      const updatedViolationRecord = await this._database.violationRecord.update({
        where: { id: violationRecord.id },
        data: {
          status: violationRecord.status.value as PrismaViolationRecordStatus,
          remarks: violationRecord.remarks.value,
          userId: violationRecord.userId,
          reportedById: violationRecord.reportedById,
          violationId: violationRecord.violationId,
          vehicleId: violationRecord.vehicleId
        }
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
        SUM(CASE WHEN vr."status" = 'PAID' THEN vrp."amountPaid" ELSE 0 END) AS "paidTotal",
        SUM(CASE WHEN vr."status" = 'UNPAID' THEN v."penalty" ELSE 0 END) AS "unpaidTotal"
      FROM "ViolationRecord" vr
      LEFT JOIN "Violation" v ON vr."violationId" = v.id
      LEFT JOIN "ViolationRecordPayment" vrp ON vrp."violationRecordId" = vr.id;
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
