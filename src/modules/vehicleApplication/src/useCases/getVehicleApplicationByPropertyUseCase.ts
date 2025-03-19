import { NotFoundError } from "../../../../shared/core/errors";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type {
  GetViolationVehicleByProperty,
  IVehicleApplicationDTO
} from "../dtos/vehicleApplicationDTO";
import type { VehicleApplicationGetRequest } from "../dtos/vehicleApplicationRequestSchema";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

export class GetVehicleApplicationByPropertyUseCase {
  private _vehicleApplicationRepository: IVehicleApplicationRepository;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper: IVehicleApplicationMapper = new VehicleApplicationMapper()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
  }

  public async execute(payload: VehicleApplicationGetRequest): Promise<IVehicleApplicationDTO[]> {
    const refinedPayload = this._refinePayload(payload);
    const vehicleApplicationDetails = await this._getVehicleApplicationByProperty(refinedPayload);

    return vehicleApplicationDetails.map((vehicleApplication) =>
      this._vehicleApplicationMapper.toDTO(vehicleApplication)
    );
  }

  private async _getVehicleApplicationByProperty(
    payload: GetViolationVehicleByProperty
  ): Promise<IVehicleApplication[]> {
    const vehicleApplicationDetails =
      await this._vehicleApplicationRepository.getVehicleApplicationByProperty(payload);
    if (!vehicleApplicationDetails || vehicleApplicationDetails.length === 0) {
      throw new NotFoundError("Vehicle Application not found");
    }

    return vehicleApplicationDetails;
  }

  private _refinePayload(payload: VehicleApplicationGetRequest): GetViolationVehicleByProperty {
    return {
      id: payload.id,
      schoolId: payload.schoolId,
      userType: payload.userType,
      driverLicenseId: payload.driverLicenseId,
      licensePlate: payload.licensePlate,
      status: payload.status,
      applicantId: payload.applicantId,
      count: Number(payload.count),
      page: Number(payload.page)
    };
  }
}
