import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import { VehicleApplicationStatus } from "../domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type { UpdateVehicleApplicationStickerRequest } from "../dtos/vehicleApplicationRequestSchema";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

export class UpdateVehicleApplicationStickerUseCase {
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
    stickerNumber
  }: UpdateVehicleApplicationStickerRequest) {
    const vehicleApplication = await this._getVehicleApplicationFromDatabase(vehicleApplicationId);
    const approvedStatus = this.getApprovedStatus();
    const updatedVehicleApplication = this.updateVehicleApplicationSticker(
      vehicleApplication,
      stickerNumber,
      approvedStatus
    );
    const savedVehicleApplication =
      await this._saveVehicleApplicationToDatabase(updatedVehicleApplication);

    return this._vehicleApplicationMapper.toDTO(savedVehicleApplication);
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

  private getApprovedStatus(): VehicleApplicationStatus {
    const statusResult = VehicleApplicationStatus.create("APPROVED");
    if (statusResult.isFailure) {
      throw new UnexpectedError("Failed to create APPROVED status");
    }
    return statusResult.getValue();
  }

  private updateVehicleApplicationSticker(
    vehicleApplication: IVehicleApplication,
    stickerNumber: string,
    approvedStatus: VehicleApplicationStatus
  ): IVehicleApplication {
    if (!stickerNumber?.trim()) {
      throw new BadRequest("Sticker number is required");
    }

    vehicleApplication.updateStickerNumber(stickerNumber);
    vehicleApplication.updateStatus(approvedStatus);

    if (vehicleApplication.stickerNumber !== stickerNumber) {
      throw new UnexpectedError("Something went wrong updating vehicle application sticker.");
    }

    if (vehicleApplication.status.value !== "APPROVED") {
      throw new UnexpectedError("Failed to update vehicle application status to APPROVED.");
    }

    return vehicleApplication;
  }

  private async _saveVehicleApplicationToDatabase(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication> {
    const savedVehicleApplication =
      await this._vehicleApplicationRepository.updateVehicleApplicationSticker(vehicleApplication);
    if (!savedVehicleApplication) {
      throw new UnexpectedError("Failed to update Vehicle Application sticker");
    }

    return savedVehicleApplication;
  }
}
