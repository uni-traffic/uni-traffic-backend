import type { IUserDTO } from "../../../user/src/dtos/userDTO";

/**
 * TODO: Include vehicle image
 */
export interface IVehicleDTO {
  id: string;
  ownerId: string;
  licensePlate: string;
  make: string;
  model: string;
  series: string;
  color: string;
  type: string;
  images: string[];
  stickerNumber: string;
  isActive: boolean;
  owner: IUserDTO;
}
