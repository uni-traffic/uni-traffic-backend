import type { UserType, VehicleApplicationStatus } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type { GetViolationVehicleByProperty } from "../dtos/vehicleApplicationDTO";

export interface IVehicleApplicationRepository {
  getVehicleApplicationByProperty(
    params: GetViolationVehicleByProperty
  ): Promise<IVehicleApplication[]>;
  createVehicleApplication(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication | null>;
  updateVehicleApplicationStatus(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication | null>;
  getVehicleApplicationById(vehicleId: string): Promise<IVehicleApplication | null>;
  getVehicleApplicationByIds(vehicleIds: string[]): Promise<IVehicleApplication[]>;
}

export class VehicleApplicationRepository implements IVehicleApplicationRepository {
  private _database;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;

  public constructor(database = db, vehicleApplicationMapper = new VehicleApplicationMapper()) {
    this._database = database;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
  }

  public async getVehicleApplicationByProperty(
    params: GetViolationVehicleByProperty
  ): Promise<IVehicleApplication[]> {
    const {
      id,
      schoolId,
      userType,
      driverLicenseId,
      licensePlate,
      status,
      applicantId,
      count,
      page
    } = params;

    try {
      const vehicleApplications = await this._database.vehicleApplication.findMany({
        take: count * page,
        skip: count * (page - 1),
        where: {
          ...{ id: id || undefined },
          ...{ schoolId: schoolId || undefined },
          ...{ userType: (userType as UserType) || undefined },
          ...{ driverLicenseId: driverLicenseId || undefined },
          ...{ licensePlate: licensePlate || undefined },
          ...{ status: (status as VehicleApplicationStatus) || undefined },
          ...{ applicantId: applicantId || undefined }
        },
        include: {
          applicant: true,
          payment: true
        }
      });

      return vehicleApplications.map((vehicleApplication) =>
        this._vehicleApplicationMapper.toDomain(vehicleApplication)
      );
    } catch {
      return [];
    }
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

  public async updateVehicleApplicationStatus(
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

    return vehicleApplicationRaw.map((vehicleApplcation) =>
      this._vehicleApplicationMapper.toDomain(vehicleApplcation)
    );
  }
}
