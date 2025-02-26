import { IUserDTO } from "../../../user/src/dtos/userDTO";
import { IVehicleDTO } from "../../../vehicle/src/dtos/vehicleDTO";
import { IViolationDTO } from "./violationDTO";

export interface IUserViolationDTO {
  id: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
  status: string;
  reporter: IUserDTO;
  violation: IViolationDTO;
  vehicle: IVehicleDTO;
}
