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
}
