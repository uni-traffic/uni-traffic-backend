import type { AuditLogType } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecordAuditLog } from "../domain/models/violationRecordAuditLog/classes/violationRecordAuditLog";
import {
  type IViolationRecordAuditLogMapper,
  ViolationRecordAuditLogMapper
} from "../domain/models/violationRecordAuditLog/mapper";
import type { GetViolationRecordAuditLogByPropertyUseCasePayload } from "../dtos/violationRecordAuditLogDTO";

export interface IViolationRecordAuditLogRepository {
  createViolationRecordAuditLog(
    violationRecordAuditLog: IViolationRecordAuditLog
  ): Promise<IViolationRecordAuditLog | null>;
  getViolationRecordAuditLogByProperty(
    params: GetViolationRecordAuditLogByPropertyUseCasePayload
  ): Promise<IViolationRecordAuditLog[]>;
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

  public async getViolationRecordAuditLogByProperty(
    params: GetViolationRecordAuditLogByPropertyUseCasePayload
  ): Promise<IViolationRecordAuditLog[]> {
    const { id, actorId, auditLogType, violationRecordId, count, page } = params;

    try {
      const violationRecordAuditLogPropertyDetails =
        await this._database.violationRecordAuditLog.findMany({
          take: count * page,
          skip: count * (page - 1),
          where: {
            ...{ id: id || undefined },
            ...{ actorId: actorId || undefined },
            ...{ auditLogType: (auditLogType as AuditLogType) || undefined },
            ...{ violationRecordId: violationRecordId || undefined }
          },
          orderBy: {
            createdAt: "desc"
          },
          include: {
            actor: true,
            violationRecord: {
              include: {
                user: true,
                vehicle: true,
                violation: true,
                reporter: true
              }
            }
          }
        });
      return violationRecordAuditLogPropertyDetails.map((violationRecordAuditLog) =>
        this._violationRecordAuditLogMapper.toDomain(violationRecordAuditLog)
      );
    } catch {
      return [];
    }
  }
}
