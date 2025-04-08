import { AuditLogAction } from "@prisma/client";
import { Result } from "../../../../../../../shared/core/result";

export class AuditLogActionType {
  private readonly _value: string;
  public static readonly validActionType = Object.values<string>(AuditLogAction);

  private constructor(value: string) {
    this._value = value;
  }

  public static create(actionType: string): Result<AuditLogActionType> {
    if (!AuditLogActionType.validActionType.includes(actionType)) {
      return Result.fail<AuditLogActionType>(
        `Invalid action type. Valid action type are ${AuditLogActionType.validActionType.join(", ")}`
      );
    }

    return Result.ok(new AuditLogActionType(actionType));
  }

  public get value(): string {
    return this._value;
  }
}
