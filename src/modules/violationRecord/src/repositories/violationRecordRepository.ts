import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";

export interface IViolationRecordRepository {
  createViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord | null>;
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
}
