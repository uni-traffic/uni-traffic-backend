import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IVehicleDTO } from "../../../vehicle/src/dtos/vehicleDTO";
import type { IViolationDTO } from "../../../violation/src/dtos/violationDTO";

export interface IViolationRecordDTO {
  id: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
  status: string;
  user: IUserDTO | null;
  reporter: IUserDTO | null;
  violation: IViolationDTO | null;
  vehicle: IVehicleDTO | null;
}

export interface ICreateViolationRecordInputUseCase {
  reportedById: string;
  violationId: string;
  vehicleId?: string;
  licensePlate?: string;
  stickerNumber?: string;
}
