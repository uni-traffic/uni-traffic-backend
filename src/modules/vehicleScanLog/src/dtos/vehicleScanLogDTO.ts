import type { IUserDTO } from "../../../user/src/dtos/userDTO";

export interface IVehicleScanLogDTO {
  id: string;
  securityId: string;
  licensePlate: string;
  time: Date;
  security: IUserDTO | null;
}
