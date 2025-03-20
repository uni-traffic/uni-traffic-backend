import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { IVehicleApplicationDTO } from "../../../../../../vehicleApplication/src/dtos/vehicleApplicationDTO";
import type { VehicleApplicationAuditLogType } from "./vehicleApplicationAuditLogType";

export interface IVehicleApplicationAuditLog {
  id: string;
  actorId: string;
  auditLogType: VehicleApplicationAuditLogType;
  vehicleApplicationId: string;
  details: string;
  createdAt: Date;
  actor: IUserDTO | undefined;
  vehicleApplication: IVehicleApplicationDTO | undefined;
}

export class VehicleApplicationAuditLog implements IVehicleApplicationAuditLog {
  private readonly _id: string;
  private readonly _actorId: string;
  private readonly _auditLogType: VehicleApplicationAuditLogType;
  private readonly _vehicleApplicationId: string;
  private readonly _details: string;
  private readonly _createdAt: Date;
  private readonly _actor: IUserDTO | undefined;
  private readonly _vehicleApplication: IVehicleApplicationDTO | undefined;

  private constructor({
    id,
    actorId,
    auditLogType,
    vehicleApplicationId,
    details,
    createdAt,
    actor,
    vehicleApplication
  }: IVehicleApplicationAuditLog) {
    this._id = id;
    this._actorId = actorId;
    this._auditLogType = auditLogType;
    this._vehicleApplicationId = vehicleApplicationId;
    this._details = details;
    this._createdAt = createdAt;
    this._actor = actor;
    this._vehicleApplication = vehicleApplication;
  }

  get id(): string {
    return this._id;
  }

  get actorId(): string {
    return this._actorId;
  }

  get auditLogType(): VehicleApplicationAuditLogType {
    return this._auditLogType;
  }

  get vehicleApplicationId(): string {
    return this._vehicleApplicationId;
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

  get vehicleApplication(): IVehicleApplicationDTO | undefined {
    return this._vehicleApplication;
  }

  public static create(props: IVehicleApplicationAuditLog): IVehicleApplicationAuditLog {
    return new VehicleApplicationAuditLog(props);
  }
}
