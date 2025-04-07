import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { AuditLogAction } from "@prisma/client";

export interface IAuditLogDTO {
  id: string;
  actionType: AuditLogAction;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  actorId: string;
  actor?: IUserDTO | null;
  objectId: string;
}
