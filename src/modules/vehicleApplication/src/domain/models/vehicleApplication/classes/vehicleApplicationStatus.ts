import { Result } from "../../../../../../../shared/core/result";
import { VehicleApplicationStatus as VehicleApplicationStatusSchema } from "@prisma/client";

export class VehicleApplicationStatus {
  private readonly _value: string;
  public static readonly validStatuses = Object.values<string>(VehicleApplicationStatusSchema);

  private static readonly allowedTransitions: Record<string, string[]> = {
    PENDING_FOR_SECURITY_APPROVAL: ["PENDING_FOR_PAYMENT", "DENIED"],
    PENDING_FOR_PAYMENT: ["PENDING_FOR_STICKER", "DENIED"],
    PENDING_FOR_STICKER: ["APPROVED", "DENIED"],
    APPROVED: [],
    DENIED: []
  };

  private constructor(value: string) {
    this._value = value;
  }

  public static create(status: string): Result<VehicleApplicationStatus> {
    if (!VehicleApplicationStatus.validStatuses.includes(status)) {
      return Result.fail<VehicleApplicationStatus>(
        `Invalid VehicleApplication status. Valid types are ${VehicleApplicationStatus.validStatuses.join(", ")}`
      );
    }
    return Result.ok(new VehicleApplicationStatus(status));
  }

  public canTransitionTo(newStatus: string): boolean {
    return VehicleApplicationStatus.allowedTransitions[this._value].includes(newStatus);
  }

  public get value(): string {
    return this._value;
  }
}
