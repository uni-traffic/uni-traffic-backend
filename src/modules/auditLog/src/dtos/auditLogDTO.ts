import type { IUserDTO } from "../../../user/src/dtos/userDTO";

export interface IAuditLogDTO {
  id: string;
  actionType: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  actorId: string;
  actor?: IUserDTO | null;
  objectId: string;
}

export interface CreateAuditLogParams {
  actionType: string;
  details: string;
  objectId: string;
  actorId: string;
}
