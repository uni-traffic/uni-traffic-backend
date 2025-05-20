import type { VehicleStatus, VehicleType } from "@prisma/client";
import { defaultTo } from "rambda";
import type { JSONObject } from "../../../../../../shared/lib/types";
import type { IVehicleDTO } from "../../../dtos/vehicleDTO";
import type { IVehicle } from "./classes/vehicle";
import type { IVehicleRawObject, IVehicleSchema } from "./constant";
import { VehicleFactory } from "./factory";

export interface IVehicleMapper {
  toPersistence(vehicle: IVehicle): IVehicleSchema;
  toDomain(raw: IVehicleRawObject): IVehicle;
  toDTO(vehicle: IVehicle): IVehicleDTO;
}

export class VehicleMapper implements IVehicleMapper {
  public toPersistence(vehicle: IVehicle): IVehicleSchema {
    return {
      id: vehicle.id,
      ownerId: vehicle.ownerId,
      make: vehicle.make,
      model: vehicle.model,
      series: vehicle.series,
      color: vehicle.color,
      images: vehicle.images.toJSON(),
      driver: vehicle.driver.toJSON(),
      schoolMember: vehicle.schoolMember.toJSON(),
      type: vehicle.type.value as VehicleType,
      status: vehicle.status.value as VehicleStatus,
      licensePlate: vehicle.licensePlate.value,
      stickerNumber: vehicle.stickerNumber.value,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    };
  }

  public toDomain(raw: IVehicleRawObject): IVehicle {
    return VehicleFactory.create({
      ...raw,
      images: raw.images as JSONObject,
      schoolMember: raw.schoolMember as JSONObject,
      driver: raw.driver as JSONObject
    }).getValue();
  }

  public toDTO(vehicle: IVehicle): IVehicleDTO {
    return {
      id: vehicle.id,
      ownerId: vehicle.ownerId,
      make: vehicle.make,
      model: vehicle.model,
      series: vehicle.series,
      color: vehicle.color,
      type: vehicle.type.value,
      status: vehicle.status.value,
      images: vehicle.images.toJSON(),
      driver: vehicle.driver.toJSON(),
      schoolMember: vehicle.schoolMember.toJSON(),
      licensePlate: vehicle.licensePlate.value,
      stickerNumber: vehicle.stickerNumber.value,
      owner: defaultTo(null, vehicle.owner)
    };
  }
}
