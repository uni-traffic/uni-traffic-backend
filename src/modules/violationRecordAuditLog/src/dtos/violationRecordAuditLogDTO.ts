import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IViolationRecordDTO } from "../../../violationRecord/src/dtos/violationRecordDTO";

export interface IViolationRecordAuditLogDTO {
  id: string;
  actorId: string;
  auditLogType: string;
  details: string;
  createdAt: Date;
  actor: IUserDTO | null;
  violationRecord: IViolationRecordDTO | null;
}

export interface ICreateViolationRecordAuditLogProps {
  actorId: string;
  auditLogType: string;
  violationRecordId: string;
  details: string;
}
