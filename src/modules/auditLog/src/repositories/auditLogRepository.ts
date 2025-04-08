import { db } from "../../../../shared/infrastructure/database/prisma";
import { AuditLogMapper, type IAuditLogMapper } from "../domain/models/auditLog/mapper";
import type { IAuditLog } from "../domain/models/auditLog/classes/auditLog";

export interface IAuditLogRepository {
  createAndSaveAuditLog(params: IAuditLog): Promise<IAuditLog | null>;
}

export class AuditLogRepository implements IAuditLogRepository {
  private _database;
  private _auditLogMapper: IAuditLogMapper;

  public constructor(database = db, auditLogMapper = new AuditLogMapper()) {
    this._database = database;
    this._auditLogMapper = auditLogMapper;
  }

  public async createAndSaveAuditLog(params: IAuditLog): Promise<IAuditLog | null> {
    try {
      const auditLogPersistence = this._auditLogMapper.toPersistence(params);

      const auditLogRaw = await this._database.auditLog.create({
        data: auditLogPersistence,
        include: {
          actor: true
        }
      });

      return this._auditLogMapper.toDomain(auditLogRaw);
    } catch {
      return null;
    }
  }
}
