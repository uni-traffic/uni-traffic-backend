import { Prisma, type UserType, type VehicleApplicationStatus } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type {
  GetViolationVehicle,
  VehicleApplicationCountByStatus,
  VehicleApplicationWhereClauseParams
} from "../dtos/vehicleApplicationDTO";

export interface IVehicleApplicationRepository {
  getVehicleApplication(params: GetViolationVehicle): Promise<IVehicleApplication[]>;
  createVehicleApplication(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication | null>;
  updateVehicleApplication(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication | null>;
  getVehicleApplicationById(vehicleId: string): Promise<IVehicleApplication | null>;
  getVehicleApplicationByIds(vehicleIds: string[]): Promise<IVehicleApplication[]>;
  getVehicleApplicationCountByStatus(
    statusFilter?: string
  ): Promise<VehicleApplicationCountByStatus>;
  getTotalVehicleApplication(params: VehicleApplicationWhereClauseParams): Promise<number>;
}

export class VehicleApplicationRepository implements IVehicleApplicationRepository {
  private _database;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;

  public constructor(database = db, vehicleApplicationMapper = new VehicleApplicationMapper()) {
    this._database = database;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
  }

  /** TODO:
   * Implement a search that matches records where:
   *   - If the given license plate is '145', return all records where the license plate contains '145' (e.g., '145TAW', 'XYZ145').
   *   - If the given id is '123', return all records where the id contains '123' (e.g., '123ABC', 'XYZ123').
   */

  public async getTotalVehicleApplication(
    params: VehicleApplicationWhereClauseParams
  ): Promise<number> {
    return this._database.vehicleApplication.count({
      where: this._generateWhereClause(params)
    });
  }

  public async getVehicleApplication(params: GetViolationVehicle): Promise<IVehicleApplication[]> {
    try {
      const vehicleApplications = await this._database.vehicleApplication.findMany({
        skip: params.count * (params.page - 1),
        take: params.count,
        where: this._generateWhereClause(params),
        orderBy: {
          createdAt: params.sort === 1 ? "asc" : "desc"
        },
        include: {
          applicant: true,
          payment: {
            include: {
              cashier: true
            }
          }
        }
      });

      return vehicleApplications.map((vehicleApplication) =>
        this._vehicleApplicationMapper.toDomain(vehicleApplication)
      );
    } catch {
      return [];
    }
  }

  private _generateWhereClause(
    params: VehicleApplicationWhereClauseParams
  ): Prisma.VehicleApplicationWhereInput {
    return params.searchKey
      ? {
          OR: [
            { id: { contains: params.searchKey, mode: "insensitive" } },
            { applicantId: { contains: params.searchKey, mode: "insensitive" } },
            { driverLastName: { contains: params.searchKey, mode: "insensitive" } },
            { driverFirstName: { contains: params.searchKey, mode: "insensitive" } },
            { firstName: { contains: params.searchKey, mode: "insensitive" } },
            { lastName: { contains: params.searchKey, mode: "insensitive" } },
            { schoolId: { contains: params.searchKey, mode: "insensitive" } }
          ],
          userType: params.userType as UserType,
          status: params.status as VehicleApplicationStatus
        }
      : {
          id: params.id,
          applicantId: params.applicantId,
          driverLastName: params.driverLastName,
          driverFirstName: params.driverFirstName,
          firstName: params.firstName,
          lastName: params.lastName,
          schoolId: params.schoolId,
          userType: params.userType as UserType,
          status: params.status as VehicleApplicationStatus
        };
  }

  public async createVehicleApplication(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication | null> {
    try {
      const vehicleApplicationRaw =
        this._vehicleApplicationMapper.toPersistence(vehicleApplication);

      const newVehicleApplication = await this._database.vehicleApplication.create({
        data: vehicleApplicationRaw
      });

      return this._vehicleApplicationMapper.toDomain(newVehicleApplication);
    } catch {
      return null;
    }
  }

  public async updateVehicleApplication(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication | null> {
    try {
      const vehicleApplicationPersistence =
        this._vehicleApplicationMapper.toPersistence(vehicleApplication);

      const newVehicleApplication = await this._database.vehicleApplication.update({
        where: {
          id: vehicleApplication.id
        },
        data: vehicleApplicationPersistence
      });

      return this._vehicleApplicationMapper.toDomain(newVehicleApplication);
    } catch {
      return null;
    }
  }

  public async getVehicleApplicationById(vehicleId: string): Promise<IVehicleApplication | null> {
    const vehicleApplication = await this.getVehicleApplicationByIds([vehicleId]);

    if (vehicleApplication.length === 0) {
      return null;
    }

    return vehicleApplication[0];
  }

  public async getVehicleApplicationByIds(vehicleIds: string[]): Promise<IVehicleApplication[]> {
    const vehicleApplicationRaw = await this._database.vehicleApplication.findMany({
      where: {
        id: {
          in: vehicleIds
        }
      }
    });

    return vehicleApplicationRaw.map((vehicleApplication) =>
      this._vehicleApplicationMapper.toDomain(vehicleApplication)
    );
  }

  public async getVehicleApplicationCountByStatus(
    statusFilter?: string
  ): Promise<VehicleApplicationCountByStatus> {
    try {
      const result = await this._database.$queryRaw<VehicleApplicationCountByStatus>(
        Prisma.sql`
          SELECT va.status, COUNT(*) as count
          FROM "VehicleApplication" va
          ${
            statusFilter !== undefined
              ? Prisma.sql`WHERE va.status = ${statusFilter}::"VehicleApplicationStatus"`
              : Prisma.sql``
          }
          GROUP BY va.status
        `
      );

      return result.map((statusCount) => {
        return { status: statusCount.status, count: Number(statusCount.count) };
      });
    } catch {
      return [];
    }
  }
}
