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
    const vehicle = await this._getVehicleByProperty(payload);
    if (!vehicle) {
      throw new NotFoundError("Vehicle not found.");
    }

    return this._vehicleMapper.toDTO(vehicle);
  }

  private async _getVehicleByProperty(payload: VehicleRequest): Promise<IVehicle | null> {
    return await this._vehicleRepository.getVehicleByProperty(payload);
  }
}
