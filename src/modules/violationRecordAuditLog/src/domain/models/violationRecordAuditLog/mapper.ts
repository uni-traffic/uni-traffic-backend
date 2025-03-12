import type { AuditLogType } from "@prisma/client";
import type { IViolationRecordAuditLogDTO } from "../../../dtos/violationRecordAuditLogDTO";
import type { IViolationRecordAuditLog } from "./classes/violationRecordAuditLog";
import type { IViolationRecordAuditLogRawObject, IViolationRecordAuditLogSchema } from "./constant";
import { ViolationRecordAuditLogFactory } from "./factory";
import { defaultTo } from "rambda";

export interface IViolationRecordAuditLogMapper {
  toPersistence(violationRecordAuditLog: IViolationRecordAuditLog): IViolationRecordAuditLogSchema;
  toDomain(raw: IViolationRecordAuditLogRawObject): IViolationRecordAuditLog;
  toDTO(violationRecordAuditLog: IViolationRecordAuditLog): IViolationRecordAuditLogDTO;
}

export class ViolationRecordAuditLogMapper implements IViolationRecordAuditLogMapper {
  public toPersistence(
    violationRecordAuditLog: IViolationRecordAuditLog
  ): IViolationRecordAuditLogSchema {
    return {
      id: violationRecordAuditLog.id,
      actorId: violationRecordAuditLog.actorId,
      auditLogType: violationRecordAuditLog.auditLogType.value as AuditLogType,
      details: violationRecordAuditLog.details,
      violationRecordId: violationRecordAuditLog.violationRecordId
    };
  }

  public toDomain(raw: IViolationRecordAuditLogRawObject): IViolationRecordAuditLog {
    return ViolationRecordAuditLogFactory.create(raw).getValue();
  }

  public toDTO(violationRecordAuditLog: IViolationRecordAuditLog): IViolationRecordAuditLogDTO {
    return {
      id: violationRecordAuditLog.id,
      actorId: violationRecordAuditLog.actorId,
      auditLogType: violationRecordAuditLog.auditLogType.value,
      details: violationRecordAuditLog.details,
      createdAt: violationRecordAuditLog.createdAt,
      actor: defaultTo(null, violationRecordAuditLog.actor),
      violationRecord: defaultTo(null, violationRecordAuditLog.violationRecord)
    };
  }
}
