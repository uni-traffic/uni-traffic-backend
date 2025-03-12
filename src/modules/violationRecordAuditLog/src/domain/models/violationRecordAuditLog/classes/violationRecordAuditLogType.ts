import { AuditLogType } from "@prisma/client";
import { Result } from "../../../../../../../shared/core/result";

export class ViolationRecordAuditLogType {
  private readonly _value: string;
  public static readonly validViolationRecordAuditLogType = Object.values<string>(AuditLogType);

  private constructor(value: string) {
    this._value = value;
  }

  public static create(auditLogType: string): Result<ViolationRecordAuditLogType> {
    if (!ViolationRecordAuditLogType.validViolationRecordAuditLogType.includes(auditLogType)) {
      return Result.fail(
        `Invalid audit log type. Valid types are ${ViolationRecordAuditLogType.validViolationRecordAuditLogType.join(", ")}`
      );
    }

    return Result.ok(new ViolationRecordAuditLogType(auditLogType));
  }

  public get value(): string {
    return this._value;
  }
}
