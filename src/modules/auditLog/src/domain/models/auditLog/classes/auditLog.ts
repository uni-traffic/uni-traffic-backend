import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { AuditLogActionType } from "./auditLogActionType";

export interface IAuditLog {
  id: string;
  actionType: AuditLogActionType;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  actorId: string;
  objectId: string;
  actor: IUserDTO | undefined;
}

export class AuditLog implements IAuditLog {
  private readonly _id: string;
  private readonly _actionType: AuditLogActionType;
  private readonly _details: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _actorId: string;
  private readonly _objectId: string;
  private readonly _actor: IUserDTO | undefined;

  private constructor({
    id,
    actionType,
    details,
    createdAt,
    updatedAt,
    actorId,
    objectId,
    actor
  }: IAuditLog) {
    this._id = id;
    this._actionType = actionType;
    this._details = details;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._actorId = actorId;
    this._objectId = objectId;
    this._actor = actor;
  }

  get id(): string {
    return this._id;
  }

  get actionType(): AuditLogActionType {
    return this._actionType;
  }

  get details(): string {
    return this._details;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get actorId(): string {
    return this._actorId;
  }

  get objectId(): string {
    return this._objectId;
  }

  get actor(): IUserDTO | undefined {
    return this._actor;
  }

  public static create(props: IAuditLog): IAuditLog {
    return new AuditLog(props);
  }
}
