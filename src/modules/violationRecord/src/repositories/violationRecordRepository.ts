import type { ViolationRecordStatus as PrismaViolationRecordStatus } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import {
  type IViolationRecordMapper,
  ViolationRecordMapper
} from "../domain/models/violationRecord/mapper";
import type { GetViolationRecordByProperty } from "../dtos/violationRecordDTO";

export interface IViolationRecordRepository {
  createViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord | null>;
  getViolationRecordByProperty(params: GetViolationRecordByProperty): Promise<IViolationRecord[]>;
  updateViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord | null>;
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
}
