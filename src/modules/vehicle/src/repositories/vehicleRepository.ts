import type { IVehicle } from "../domain/models/vehicle/classes/vehicle";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IVehicleMapper } from "../domain/models/vehicle/mapper";
import { VehicleMapper } from "../domain/models/vehicle/mapper";

export interface IVehicleRepository {
  getVehicleById(vehicleId: string): Promise<IVehicle | null>;
  getVehiclesByIds(vehicleIds: string[]): Promise<IVehicle[]>;
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
}
