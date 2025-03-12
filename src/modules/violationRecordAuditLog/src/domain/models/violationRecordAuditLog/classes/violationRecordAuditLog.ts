import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { IViolationRecordDTO } from "../../../../../../violationRecord/src/dtos/violationRecordDTO";
import type { ViolationRecordAuditLogType } from "./violationRecordAuditLogType";

export interface IViolationRecordAuditLog {
  id: string;
  actorId: string;
  auditLogType: ViolationRecordAuditLogType;
  violationRecordId: string;
  details: string;
  createdAt: Date;
  actor: IUserDTO | undefined;
  violationRecord: IViolationRecordDTO | undefined;
}

export class ViolationRecordAuditLog implements IViolationRecordAuditLog {
  private readonly _id: string;
  private readonly _actorId: string;
  private readonly _auditLogType: ViolationRecordAuditLogType;
  private readonly _violationRecordId: string;
  private readonly _details: string;
  private readonly _createdAt: Date;
  private readonly _actor: IUserDTO | undefined;
  private readonly _violationRecord: IViolationRecordDTO | undefined;

  private constructor({
    id,
    actorId,
    auditLogType,
    violationRecordId,
    details,
    createdAt,
    actor,
    violationRecord
  }: IViolationRecordAuditLog) {
    this._id = id;
    this._actorId = actorId;
    this._auditLogType = auditLogType;
    this._violationRecordId = violationRecordId;
    this._details = details;
    this._createdAt = createdAt;
    this._actor = actor;
    this._violationRecord = violationRecord;
  }

  get id(): string {
    return this._id;
  }

  get actorId(): string {
    return this._actorId;
  }

  get auditLogType(): ViolationRecordAuditLogType {
    return this._auditLogType;
  }

  get violationRecordId(): string {
    return this._violationRecordId;
  }

  get details(): string {
    return this._details;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get actor(): IUserDTO | undefined {
    return this._actor;
  }

  get violationRecord(): IViolationRecordDTO | undefined {
    return this._violationRecord;
  }

  public static create(props: IViolationRecordAuditLog): IViolationRecordAuditLog {
    return new ViolationRecordAuditLog(props);
  }
}
