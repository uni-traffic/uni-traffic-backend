import type { IUserDTO } from "../../../user/src/dtos/userDTO";

/**
 * TODO: Include vehicle image
 */
export interface IVehicleDTO {
  id: string;
  ownerId: string;
  licenseNumber: string;
  stickerNumber: string;
  isActive: boolean;
  owner: IUserDTO;
}
