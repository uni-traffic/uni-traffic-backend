import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";
import type { ViolationRecordGetRequest } from "../dtos/violationRecordRequestSchema";

export interface IViolationRecordRepository {
  createViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord | null>;
  getViolationRecordByProperty(params: ViolationRecordGetRequest): Promise<IViolationRecord[]>;
}

export class ViolationRecordRepository implements IViolationRecordRepository {
  private _database;
  private _violationRecordMapper: ViolationRecordMapper;

  public constructor(database = db, violationRecordMapper = new ViolationRecordMapper()) {
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
    params: ViolationRecordGetRequest
  ): Promise<IViolationRecord[]> {
    const { id, userId, violationId, reportedById, vehicleId , status} = params;
    if (!id && !userId && !violationId && !reportedById  && !vehicleId && !status) {
      return [];
    }

    try {
      const violationRecordRaw = await this._database.violationRecord.findMany({
        where: {
          ...{ id: id || undefined },
          ...{ userId: userId || undefined },
          ...{ violationId: violationId || undefined },
          ...{ reportedById: reportedById || undefined },
          ...{ vehicleId: vehicleId || undefined },
          ...{ status: status || undefined }
        },
        include: { reporter: true, user: true, vehicle: true, violation: true }
      });

      return violationRecordRaw.map((violationRecord) =>
        this._violationRecordMapper.toDomain(violationRecord)
      );
    } catch {
      return [];
    }
  }
}
