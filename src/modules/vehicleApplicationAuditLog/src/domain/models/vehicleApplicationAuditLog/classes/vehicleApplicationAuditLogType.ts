import { AuditLogType } from "@prisma/client";
import { Result } from "../../../../../../../shared/core/result";

export class VehicleApplicationAuditLogType {
  private readonly _value: string;
  public static readonly validVehicleApplicationAuditLogType = Object.values<string>(AuditLogType);

  private constructor(value: string) {
    this._value = value;
  }

  public static create(auditLogType: string): Result<VehicleApplicationAuditLogType> {
    if (
      !VehicleApplicationAuditLogType.validVehicleApplicationAuditLogType.includes(auditLogType)
    ) {
      return Result.fail(
        `Invalid audit log type. Valid types are ${VehicleApplicationAuditLogType.validVehicleApplicationAuditLogType.join(", ")}`
      );
    }

    return Result.ok(new VehicleApplicationAuditLogType(auditLogType));
  }

  public get value(): string {
    return this._value;
  }
}
