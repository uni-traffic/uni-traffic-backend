import { BadRequest, NotFoundError } from "../../../../../shared/core/errors";
import type { IVehicleApplication } from "../../domain/models/vehicleApplication/classes/vehicleApplication";
import { VehicleApplicationStatus } from "../../domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import type { IUpdateVehicleApplicationProps } from "../../dtos/vehicleApplicationDTO";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../repositories/vehicleApplicationRepository";

export interface IVehicleApplicationService {
  updateStatus(
    vehicleApplicationId: IUpdateVehicleApplicationProps
  ): Promise<IVehicleApplication | null>;
}

export class VehicleApplicationService implements IVehicleApplicationService {
  private _vehicleApplicationRepository: IVehicleApplicationRepository;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
  }

  public async updateStatus(
    vehicleApplicationId: IUpdateVehicleApplicationProps
  ): Promise<IVehicleApplication> {
    const vehicleApplication = await this._vehicleApplicationRepository.getVehicleApplicationById(
      vehicleApplicationId.vehicleApplicationId
    );

    if (!vehicleApplication) {
      throw new NotFoundError("Vehicle Application not found");
    }

    if (vehicleApplication.status.value === "PENDING_FOR_STICKER") {
      throw new BadRequest("Vehicle Application Status is already pending for sticker");
    }

    vehicleApplication.updateStatus(
      VehicleApplicationStatus.create("PENDING_FOR_STICKER").getValue()
    );

    const updatedVehicleApplication =
      await this._vehicleApplicationRepository.updateVehicleApplicationStatus(vehicleApplication);

    if (!updatedVehicleApplication) {
      throw new BadRequest("Failed to updated vehicle application");
    }

    return updatedVehicleApplication;
  }
}
