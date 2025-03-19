import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IVehicleDTO } from "../../../vehicle/src/dtos/vehicleDTO";

export interface IVehicleAuditLogDTO {
  id: string;
  actorId: string;
  vehicleId: string;
  auditLogType: string;
  details: string;
  createdAt: Date;
  actor: IUserDTO | null;
  vehicle: IVehicleDTO | null;
}
