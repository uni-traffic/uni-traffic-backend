import type { IAuditLog } from "./classes/auditLog";
import type { IAuditLogRawObject, IAuditLogSchema } from "./constant";
import type { IAuditLogDTO } from "../../../dtos/auditLogDTO";
import { AuditLogFactory } from "./factory";
import type { AuditLogAction } from "@prisma/client";

export interface IAuditLogMapper {
  toPersistence(auditLog: IAuditLog): IAuditLogSchema;
  toDomain(raw: IAuditLogRawObject): IAuditLog;
  toDTO(auditLog: IAuditLog): IAuditLogDTO;
}

export class AuditLogMapper implements IAuditLogMapper {
  public toPersistence(auditLog: IAuditLog): IAuditLogSchema {
    return {
      id: auditLog.id,
      actionType: auditLog.actionType.value as AuditLogAction,
      details: auditLog.details,
      createdAt: auditLog.createdAt,
      updatedAt: auditLog.updatedAt,
      actorId: auditLog.actorId,
      objectId: auditLog.objectId
    };
  }

  public toDomain(raw: IAuditLogRawObject): IAuditLog {
    return AuditLogFactory.create(raw).getValue();
  }

  public toDTO(auditLog: IAuditLog): IAuditLogDTO {
    return {
      id: auditLog.id,
      actionType: auditLog.actionType.value,
      details: auditLog.details,
      createdAt: auditLog.createdAt,
      updatedAt: auditLog.updatedAt,
      actorId: auditLog.actorId,
      actor: auditLog.actor,
      objectId: auditLog.objectId
    };
  }
}
