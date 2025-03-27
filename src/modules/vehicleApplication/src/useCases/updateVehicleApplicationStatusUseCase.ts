import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import { VehicleApplicationStatus } from "../domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

export class UpdateVehicleApplicationStatusUseCase {
  private _vehicleApplicationRepository: IVehicleApplicationRepository;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper: IVehicleApplicationMapper = new VehicleApplicationMapper()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
  }

  public async execute({
    vehicleApplicationId,
    status
  }: { vehicleApplicationId: string; status: string }) {
    const vehicleApplcation = await this._getVehicleApplicationFromDatabase(vehicleApplicationId);
    const newStatus = this.getVehicleApplicationNewStatus(status);
    const updatedVehicleApplication = this.updateVehicleApplicationStatus(
      vehicleApplcation,
      newStatus
    );
    const savedVehicleApplcationStatus =
      await this._saveVehicleApplicationToDatabase(updatedVehicleApplication);

    return this._vehicleApplicationMapper.toDTO(savedVehicleApplcationStatus);
  }

  private async _getVehicleApplicationFromDatabase(
    vehicleApplicationId: string
  ): Promise<IVehicleApplication> {
    const vehicleApplication =
      await this._vehicleApplicationRepository.getVehicleApplicationById(vehicleApplicationId);

    if (!vehicleApplication) {
      throw new NotFoundError("Vehicle Application Not Found");
    }

    return vehicleApplication;
  }

  private getVehicleApplicationNewStatus(status: string): VehicleApplicationStatus {
    const newStatus = VehicleApplicationStatus.create(status);

    if (newStatus.isFailure) {
      throw new BadRequest(newStatus.getErrorMessage()!);
    }

    return newStatus.getValue();
  }

  private updateVehicleApplicationStatus(
    vehicleApplcation: IVehicleApplication,
    status: VehicleApplicationStatus,
    remarks?: string
  ): IVehicleApplication {
    vehicleApplcation.updateStatus(status, remarks);

    if (vehicleApplcation.status.value !== status.value) {
      throw new UnexpectedError("Something went wrong updating vehicle application status.");
    }

    return vehicleApplcation;
  }

  private async _saveVehicleApplicationToDatabase(
    vehicleApplcation: IVehicleApplication
  ): Promise<IVehicleApplication> {
    const savedVehicleApplcation =
      await this._vehicleApplicationRepository.updateVehicleApplicationStatus(vehicleApplcation);
    if (!savedVehicleApplcation) {
      throw new UnexpectedError("Failed to update Vehicle Application");
    }

    return savedVehicleApplcation;
  }
}
