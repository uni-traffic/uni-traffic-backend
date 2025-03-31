import { BadRequest, UnexpectedError } from "../../../../shared/core/errors";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import {
  type IVehicleApplicationProps,
  VehicleApplicationFactory
} from "../domain/models/vehicleApplication/factory";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type { IVehicleApplicationDTO } from "../dtos/vehicleApplicationDTO";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

/** TODO:
 * 1. Ensure files given exist.
 * 2. Move the files from temp to uploads. Add application id to the file
 */

export class CreateVehicleApplicationUseCase {
  private _vehicleApplicationRepository: IVehicleApplicationRepository;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper: IVehicleApplicationMapper = new VehicleApplicationMapper()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
  }

  public async execute(params: IVehicleApplicationProps): Promise<IVehicleApplicationDTO> {
    const vehicleApplication = this._createVehicleApplicationDomainObject(params);
    const saveVehicleApplication = await this._saveVehicleApplication(vehicleApplication);

    return this._vehicleApplicationMapper.toDTO(saveVehicleApplication);
  }

  private _createVehicleApplicationDomainObject(
    params: IVehicleApplicationProps
  ): IVehicleApplication {
    const vehicleApplicationOrError = VehicleApplicationFactory.create(params);
    if (vehicleApplicationOrError.isFailure) {
      throw new BadRequest(vehicleApplicationOrError.getErrorMessage()!);
    }

    return vehicleApplicationOrError.getValue();
  }

  private async _saveVehicleApplication(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication> {
    const savedVehicleApplication =
      await this._vehicleApplicationRepository.createVehicleApplication(vehicleApplication);
    if (!savedVehicleApplication) {
      throw new UnexpectedError("Failed to save vehicle application");
    }

    return savedVehicleApplication;
  }
}
