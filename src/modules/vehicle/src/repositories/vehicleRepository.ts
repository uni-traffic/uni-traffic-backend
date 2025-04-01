import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IVehicle } from "../domain/models/vehicle/classes/vehicle";
import type { IVehicleMapper } from "../domain/models/vehicle/mapper";
import { VehicleMapper } from "../domain/models/vehicle/mapper";
import type { VehicleRequest } from "../dtos/vehicleRequestSchema";

export interface IVehicleRepository {
  getVehicleById(vehicleId: string): Promise<IVehicle | null>;
  getVehiclesByIds(vehicleIds: string[]): Promise<IVehicle[]>;
  getVehicleByProperty(params: VehicleRequest): Promise<IVehicle | null>;
  createVehicle(vehicle: IVehicle): Promise<IVehicle | null>;
  createVehicles(vehicles: IVehicle[]): Promise<IVehicle[]>;
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

  /** TODO:
   * 1. Implement a search that matches records where:
   *     - If the given license plate is '145', return all records where the license plate contains '145' (e.g., '145TAW', 'XYZ145').
   *     - If the given stickerNumber is '123', return all records where the stickerNumber contains '123' (e.g., '123ABC', 'XYZ123').
   * 2. Return an Array of IVehicle instead.
   */
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
          ...{ licensePlate: licensePlate || undefined }
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
  public async createVehicle(vehicle: IVehicle): Promise<IVehicle | null> {
    const createdVehicles = await this.createVehicles([vehicle]);

    if (createdVehicles.length === 0) {
      return null;
    }

    return createdVehicles[0];
  }
  public async createVehicles(vehicles: IVehicle[]): Promise<IVehicle[]> {
    try {
      const createdVehiclesRaw = await this._database.$transaction(
        vehicles.map((vehicle) => {
          return this._database.vehicle.create({
            data: this._vehicleMapper.toPersistence(vehicle)
          });
        })
      );

      return createdVehiclesRaw.map((vehicle) => this._vehicleMapper.toDomain(vehicle));
    } catch {
      return [];
    }
  }
}
