import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import { VehicleApplicationStatus } from "../domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type { UpdateVehicleApplicationStatusRequest } from "../dtos/vehicleApplicationRequestSchema";
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
    status,
    remarks
  }: UpdateVehicleApplicationStatusRequest) {
    const vehicleApplication = await this._getVehicleApplicationFromDatabase(vehicleApplicationId);
    const newStatus = this.getVehicleApplicationNewStatus(status);
    const updatedVehicleApplication = this.updateVehicleApplicationStatus(
      vehicleApplication,
      newStatus,
      remarks
    );
    const saveVehicleApplication =
      await this._saveVehicleApplicationToDatabase(updatedVehicleApplication);

    return this._vehicleApplicationMapper.toDTO(saveVehicleApplication);
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
    vehicleApplication: IVehicleApplication,
    status: VehicleApplicationStatus,
    remarks?: string
  ): IVehicleApplication {
    vehicleApplication.updateStatus(status, remarks);
    if (vehicleApplication.status.value !== status.value) {
      throw new UnexpectedError("Something went wrong updating vehicle application status.");
    }

    return vehicleApplication;
  }

  private async _saveVehicleApplicationToDatabase(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication> {
    const savedVehicleApplication =
      await this._vehicleApplicationRepository.updateVehicleApplication(vehicleApplication);
    if (!savedVehicleApplication) {
      throw new UnexpectedError("Failed to update Vehicle Application");
    }

    return savedVehicleApplication;
  }
}
