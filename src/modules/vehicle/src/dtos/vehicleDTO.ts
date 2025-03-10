import type { IUserDTO } from "../../../user/src/dtos/userDTO";

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
  status: string;
  stickerNumber: string;
  owner: IUserDTO | null;
}
