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

export interface GetVehicleParams {
  id?: string;
  ownerId?: string;
  licensePlate?: string;
  stickerNumber?: string;
  sort?: 1 | 2;
  searchKey?: string;
  count: number;
  page: number;
}

export interface VehicleWhereClauseParams {
  id?: string;
  ownerId?: string;
  licensePlate?: string;
  stickerNumber?: string;
  searchKey?: string;
}

export interface GetVehicleResponse {
  vehicles: IVehicleDTO[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}
