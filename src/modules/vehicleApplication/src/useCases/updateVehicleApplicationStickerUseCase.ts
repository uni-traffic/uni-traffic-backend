import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import { type IUserService, UserService } from "../../../user/src/shared/service/userService";
import type { IVehicleDTO } from "../../../vehicle/src/dtos/vehicleDTO";
import { type IVehicleService, VehicleService } from "../../../vehicle/src/service/vehicleService";
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
  private _vehicleService: IVehicleService;
  private _userService: IUserService;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper: IVehicleApplicationMapper = new VehicleApplicationMapper(),
    vehicleService: IVehicleService = new VehicleService(),
    userService: IUserService = new UserService()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
    this._vehicleService = vehicleService;
    this._userService = userService;
  }

  public async execute({
    vehicleApplicationId,
    stickerNumber
  }: UpdateVehicleApplicationStickerRequest) {
    const vehicleApplication = await this._getVehicleApplicationFromDatabase(vehicleApplicationId);

    await this._createNewVehicle(vehicleApplication, stickerNumber);
    await this._updateUserRole(vehicleApplication);

    const approvedStatus = this._getApprovedStatus();
    const updatedVehicleApplication = this._updateVehicleApplicationSticker(
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

  private async _createNewVehicle(
    vehicleApplication: IVehicleApplication,
    stickerNumber: string
  ): Promise<IVehicleDTO> {
    return await this._vehicleService.createVehicle({
      ownerId: vehicleApplication.applicantId,
      type: vehicleApplication.vehicle.type,
      color: "",
      images: [
        vehicleApplication.vehicle.frontImage,
        vehicleApplication.vehicle.backImage,
        vehicleApplication.vehicle.sideImage
      ],
      licensePlate: vehicleApplication.vehicle.licensePlate,
      make: vehicleApplication.vehicle.make,
      model: vehicleApplication.vehicle.model,
      series: vehicleApplication.vehicle.series,
      stickerNumber: stickerNumber
    });
  }

  private async _updateUserRole(vehicleApplication: IVehicleApplication): Promise<IUserDTO> {
    return this._userService.updateUserRole({
      userId: vehicleApplication.applicantId,
      role: vehicleApplication.schoolMember.type
    });
  }

  private _getApprovedStatus(): VehicleApplicationStatus {
    const statusResult = VehicleApplicationStatus.create("APPROVED");
    if (statusResult.isFailure) {
      throw new UnexpectedError("Failed to create APPROVED status");
    }

    return statusResult.getValue();
  }

  private _updateVehicleApplicationSticker(
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
