import { NotFoundError } from "../../../../shared/core/errors";
import type { IVehicle } from "../domain/models/vehicle/classes/vehicle";
import { type IVehicleMapper, VehicleMapper } from "../domain/models/vehicle/mapper";
import type { IVehicleDTO } from "../dtos/vehicleDTO";
import type { VehicleRequest } from "../dtos/vehicleRequestSchema";
import { type IVehicleRepository, VehicleRepository } from "../repositories/vehicleRepository";

export class GetVehicleInformationUseCase {
  private _vehicleRepository: IVehicleRepository;
  private _vehicleMapper: IVehicleMapper;

  public constructor(
    vehicleRepository: IVehicleRepository = new VehicleRepository(),
    vehicleMapper: IVehicleMapper = new VehicleMapper()
  ) {
    this._vehicleRepository = vehicleRepository;
    this._vehicleMapper = vehicleMapper;
  }

  public async execute(payload: VehicleRequest): Promise<IVehicleDTO> {
    const refinedPayload = this._refinePayload(payload);
    const vehicle = await this._getVehicleDetails(refinedPayload);

    return this._vehicleMapper.toDTO(vehicle);
  }

  private _refinePayload(payload: VehicleRequest): VehicleRequest {
    return {
      id: payload.id || undefined,
      licensePlate: payload.licensePlate?.toUpperCase().replace(" ", "") || undefined,
      stickerNumber: payload.stickerNumber || undefined
    };
  }

  private async _getVehicleDetails(payload: VehicleRequest): Promise<IVehicle> {
    const vehicle = await this._vehicleRepository.getVehicleByProperty(payload);
    if (!vehicle) {
      throw new NotFoundError("Vehicle not found.");
    }

    return vehicle;
  }
}
