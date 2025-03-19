import { AuditLogType } from "@prisma/client";
import { Result } from "../../../../../../../shared/core/result";

export class VehicleAuditLogType {
  private readonly _value: string;
  public static readonly validVehicleAuditLogType = Object.values<string>(AuditLogType);

  private constructor(value: string) {
    this._value = value;
  }

  public static create(auditLogType: string): Result<VehicleAuditLogType> {
    if (!VehicleAuditLogType.validVehicleAuditLogType.includes(auditLogType)) {
      return Result.fail(
        `Invalid audit log type. Valid types are ${VehicleAuditLogType.validVehicleAuditLogType.join(", ")}`
      );
    }

    return Result.ok(new VehicleAuditLogType(auditLogType));
  }

  public get value(): string {
    return this._value;
  }
}
