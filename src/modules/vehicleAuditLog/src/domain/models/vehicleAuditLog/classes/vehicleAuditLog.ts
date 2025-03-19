import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { IVehicleDTO } from "../../../../../../vehicle/src/dtos/vehicleDTO";
import type { VehicleAuditLogType } from "./vehicleAuditLogType";

export interface IVehicleAuditLog {
  id: string;
  actorId: string;
  auditLogType: VehicleAuditLogType;
  vehicleId: string;
  details: string;
  createdAt: Date;
  actor: IUserDTO | undefined;
  vehicle: IVehicleDTO | undefined;
}

export class VehicleAuditLog implements IVehicleAuditLog {
  private readonly _id: string;
  private readonly _actorId: string;
  private readonly _auditLogType: VehicleAuditLogType;
  private readonly _vehicleId: string;
  private readonly _details: string;
  private readonly _createdAt: Date;
  private readonly _actor: IUserDTO | undefined;
  private readonly _vehicle: IVehicleDTO | undefined;

  private constructor({
    id,
    actorId,
    auditLogType,
    vehicleId,
    details,
    createdAt,
    actor,
    vehicle
  }: IVehicleAuditLog) {
    this._id = id;
    this._actorId = actorId;
    this._auditLogType = auditLogType;
    this._vehicleId = vehicleId;
    this._details = details;
    this._createdAt = createdAt;
    this._actor = actor;
    this._vehicle = vehicle;
  }

  get id(): string {
    return this._id;
  }

  get actorId(): string {
    return this._actorId;
  }

  get auditLogType(): VehicleAuditLogType {
    return this._auditLogType;
  }

  get vehicleId(): string {
    return this._vehicleId;
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

  get vehicle(): IVehicleDTO | undefined {
    return this._vehicle;
  }

  public static create(props: IVehicleAuditLog): IVehicleAuditLog {
    return new VehicleAuditLog(props);
  }
}
