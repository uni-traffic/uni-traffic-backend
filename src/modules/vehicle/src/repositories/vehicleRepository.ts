import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IVehicle } from "../domain/models/vehicle/classes/vehicle";
import type { IVehicleMapper } from "../domain/models/vehicle/mapper";
import { VehicleMapper } from "../domain/models/vehicle/mapper";
import type { VehicleRequest } from "../dtos/vehicleRequestSchema";

export interface IVehicleRepository {
  getVehicleById(vehicleId: string): Promise<IVehicle | null>;
  getVehiclesByIds(vehicleIds: string[]): Promise<IVehicle[]>;
  getVehicleByProperty(params: VehicleRequest): Promise<IVehicle | null>;
}

export class VehicleRepository implements IVehicleRepository {
  private _database;
  private _vehicleMapper: IVehicleMapper;

  public constructor(database = db, vehicleMapper = new VehicleMapper()) {
    this._database = database;
    this._vehicleMapper = vehicleMapper;
  }

  public async getVehicleById(vehicleId: string): Promise<IVehicle | null> {
    const vehicles = await this.getVehiclesByIds([vehicleId]);

    if (vehicles.length === 0) {
      return null;
    }

    return vehicles[0];
  }

  public async getVehiclesByIds(vehicleIds: string[]): Promise<IVehicle[]> {
    const vehiclesRaw = await this._database.vehicle.findMany({
      where: {
        id: {
          in: vehicleIds
        }
      },
      include: { owner: true }
    });

    return vehiclesRaw.map((vehicle) => this._vehicleMapper.toDomain(vehicle));
  }

  public async getVehicleByProperty(params: VehicleRequest): Promise<IVehicle | null> {
    const { id, stickerNumber, licensePlate } = params;
    if (!id && !stickerNumber && !licensePlate) {
      return null;
    }

    try {
      const vehicleRaw = await this._database.vehicle.findUniqueOrThrow({
        where: {
          ...{ id: id || undefined },
          ...{ stickerNumber: stickerNumber || undefined },
          ...{ licenseNumber: licensePlate || undefined }
        },
        include: {
          owner: true
        }
      });

      return this._vehicleMapper.toDomain(vehicleRaw);
    } catch {
      return null;
    }
  }
}
