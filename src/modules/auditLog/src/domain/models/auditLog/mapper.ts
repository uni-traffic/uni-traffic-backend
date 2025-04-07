import { AuditLog } from "./classes/auditLog";
import type { IAuditLog } from "./classes/auditLog";
import type { IAuditLogRawObject, IAuditLogSchema } from "./constant";
import type { IAuditLogDTO } from "../../../dtos/auditLogDTO";

export interface IAuditLogMapper {
  toPersistence(auditLog: IAuditLog): IAuditLogSchema;
  toDomain(raw: IAuditLogRawObject): IAuditLog;
  toDTO(auditLog: IAuditLog): IAuditLogDTO;
}

export class AuditLogMapper implements IAuditLogMapper {
  public toPersistence(auditLog: IAuditLog): IAuditLogSchema {
    return {
      id: auditLog.id,
      actionType: auditLog.actionType,
      details: auditLog.details,
      createdAt: auditLog.createdAt,
      updatedAt: auditLog.updatedAt,
      actorId: auditLog.actorId,
      objectId: auditLog.objectId
    };
  }

  public toDomain(raw: IAuditLogRawObject): IAuditLog {
    return AuditLog.create({
      id: raw.id,
      actionType: raw.actionType,
      details: raw.details,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      actorId: raw.actorId,
      actor: raw.actor,
      objectId: raw.objectId
    });
  }

  public toDTO(auditLog: IAuditLog): IAuditLogDTO {
    return {
      id: auditLog.id,
      actionType: auditLog.actionType,
      details: auditLog.details,
      createdAt: auditLog.createdAt,
      updatedAt: auditLog.updatedAt,
      actorId: auditLog.actorId,
      actor: auditLog.actor,
      objectId: auditLog.objectId
    };
  }
}
