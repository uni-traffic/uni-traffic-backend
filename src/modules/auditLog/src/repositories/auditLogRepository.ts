import type { AuditLogAction, Prisma } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IAuditLog } from "../domain/models/auditLog/classes/auditLog";
import { AuditLogMapper, type IAuditLogMapper } from "../domain/models/auditLog/mapper";
import type { AuditLogsWhereClauseParams, GetAuditLogParams } from "../dtos/auditLogDTO";

export interface IAuditLogRepository {
  createAndSaveAuditLog(params: IAuditLog): Promise<IAuditLog | null>;
  getAuditLog(params: GetAuditLogParams): Promise<IAuditLog[]>;
  countTotalAuditLogs(params: AuditLogsWhereClauseParams): Promise<number>;
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

  public async getAuditLog(params: GetAuditLogParams): Promise<IAuditLog[]> {
    const auditLogsRaw = await this._database.auditLog.findMany({
      where: this._generateWhereClause(params),
      orderBy: { createdAt: params.sort === 2 ? "asc" : "desc" },
      skip: params.count * (params.page - 1),
      take: params.count,
      include: {
        actor: true
      }
    });

    return auditLogsRaw.map((auditLog) => this._auditLogMapper.toDomain(auditLog));
  }

  public async countTotalAuditLogs(params: AuditLogsWhereClauseParams): Promise<number> {
    return this._database.auditLog.count({
      where: this._generateWhereClause(params)
    });
  }

  private _generateWhereClause(params: AuditLogsWhereClauseParams): Prisma.AuditLogWhereInput {
    return params.searchKey
      ? {
          OR: [
            { objectId: { contains: params.searchKey, mode: "insensitive" } },
            { actorId: { contains: params.searchKey, mode: "insensitive" } }
          ],
          actionType: params.actionType as AuditLogAction
        }
      : {
          objectId: params.objectId,
          actorId: params.actorId,
          actionType: params.actionType as AuditLogAction
        };
  }
}
