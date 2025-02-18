import type { IVehicleDTO } from "../../../dtos/vehicleDTO";
import type { IVehicle } from "./classes/vehicle";
import type { IVehicleRawObject, IVehicleSchema } from "./constant";
import { VehicleFactory } from "./factory";

export interface IVehicleMapper {
  toPersistence(vehicle: IVehicle): IVehicleSchema;
  toDomain(raw: IVehicleRawObject): IVehicle;
  toDTO(vehicle: IVehicle): IVehicleDTO;
}

export class VehicleMapper {
  public toPersistence(vehicle: IVehicle): IVehicleSchema {
    return {
      id: vehicle.id,
      ownerId: vehicle.ownerId,
      licenseNumber: vehicle.licenseNumber.value,
      stickerNumber: vehicle.stickerNumber.value,
      isActive: vehicle.isActive,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    };
  }

  public toDomain(raw: IVehicleRawObject): IVehicle {
    return VehicleFactory.create(raw).getValue();
  }

  public toDTO(vehicle: IVehicle): IVehicleDTO {
    return {
      id: vehicle.id,
      ownerId: vehicle.ownerId,
      licenseNumber: vehicle.licenseNumber.value,
      stickerNumber: vehicle.stickerNumber.value,
      isActive: vehicle.isActive
    };
  }
}
