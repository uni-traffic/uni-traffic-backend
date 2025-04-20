import type { Prisma } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IVehicle } from "../domain/models/vehicle/classes/vehicle";
import type { IVehicleMapper } from "../domain/models/vehicle/mapper";
import { VehicleMapper } from "../domain/models/vehicle/mapper";
import type { GetVehicleParams, VehicleWhereClauseParams } from "../dtos/vehicleDTO";
import type { VehicleRequest } from "../dtos/vehicleRequestSchema";

export interface IVehicleRepository {
  getVehicleById(vehicleId: string): Promise<IVehicle | null>;
  getVehiclesByIds(vehicleIds: string[]): Promise<IVehicle[]>;
  getVehicleByProperty(params: VehicleRequest): Promise<IVehicle | null>;
  createVehicle(vehicle: IVehicle): Promise<IVehicle | null>;
  createVehicles(vehicles: IVehicle[]): Promise<IVehicle[]>;
  getVehicles(params: GetVehicleParams): Promise<IVehicle[]>;
  countTotalVehicles(params: GetVehicleParams): Promise<number>;
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

  public async getVehicles(params: GetVehicleParams): Promise<IVehicle[]> {
    const vehicleRaw = await this._database.vehicle.findMany({
      where: this._generateWhereClause(params),
      orderBy: { stickerNumber: params.sort === 2 ? "asc" : "desc" },
      skip: params.count * (params.page - 1),
      take: params.count,
      include: {
        owner: true
      }
    });

    return vehicleRaw.map((vehicle) => this._vehicleMapper.toDomain(vehicle));
  }

  public async countTotalVehicles(params: VehicleWhereClauseParams): Promise<number> {
    return this._database.vehicle.count({
      where: this._generateWhereClause(params)
    });
  }

  private _generateWhereClause(params: VehicleWhereClauseParams): Prisma.VehicleWhereInput {
    return params.searchKey
      ? {
          OR: [
            { id: { contains: params.searchKey, mode: "insensitive" } },
            { ownerId: { contains: params.searchKey, mode: "insensitive" } },
            { licensePlate: { contains: params.searchKey, mode: "insensitive" } },
            { stickerNumber: { contains: params.searchKey, mode: "insensitive" } }
          ]
        }
      : {
          id: params.id,
          ownerId: params.ownerId,
          licensePlate: params.licensePlate,
          stickerNumber: params.stickerNumber
        };
  }
}
