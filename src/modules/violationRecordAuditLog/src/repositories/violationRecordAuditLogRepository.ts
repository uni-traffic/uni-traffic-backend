import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecordAuditLog } from "../domain/models/violationRecordAuditLog/classes/violationRecordAuditLog";
import {
  type IViolationRecordAuditLogMapper,
  ViolationRecordAuditLogMapper
} from "../domain/models/violationRecordAuditLog/mapper";

export interface IViolationRecordAuditLogRepository {
  createViolationRecordAuditLog(
    violationRecordAuditLog: IViolationRecordAuditLog
  ): Promise<IViolationRecordAuditLog | null>;
}

export class ViolationRecordAuditLogRepository implements IViolationRecordAuditLogRepository {
  private _database;
  private _violationRecordAuditLogMapper: IViolationRecordAuditLogMapper;

  public constructor(database = db, violationRecordMapper = new ViolationRecordAuditLogMapper()) {
    this._database = database;
    this._violationRecordAuditLogMapper = violationRecordMapper;
  }

  public async createViolationRecordAuditLog(
    violationRecordAuditLog: IViolationRecordAuditLog
  ): Promise<IViolationRecordAuditLog | null> {
    try {
      const violationRecordAuditLogPersistence =
        this._violationRecordAuditLogMapper.toPersistence(violationRecordAuditLog);

      const newViolationRecord = await this._database.violationRecordAuditLog.create({
        data: violationRecordAuditLogPersistence
      });

      return this._violationRecordAuditLogMapper.toDomain(newViolationRecord);
    } catch {
      return null;
    }
  }
}
