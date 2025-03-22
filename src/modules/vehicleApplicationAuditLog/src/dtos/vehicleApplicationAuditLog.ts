import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IVehicleApplicationDTO } from "../../../vehicleApplication/src/dtos/vehicleApplicationDTO";

export interface IVehicleApplicationAuditLogDTO {
  id: string;
  actorId: string;
  vehicleApplicationId: string;
  auditLogType: string;
  details: string;
  createdAt: Date;
  actor: IUserDTO | null;
  vehicleApplication: IVehicleApplicationDTO | null;
}
