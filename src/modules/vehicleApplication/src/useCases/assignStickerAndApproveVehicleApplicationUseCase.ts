import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import { ProtectedUseCase } from "../../../../shared/domain/useCase";
import type { UseCaseActorInfo } from "../../../../shared/lib/types";
import {
  AuditLogService,
  type IAuditLogService
} from "../../../auditLog/src/service/auditLogService";
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
import type { IVehicleApplicationDTO } from "../dtos/vehicleApplicationDTO";
import type { UpdateVehicleApplicationStickerRequest } from "../dtos/vehicleApplicationRequestSchema";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

export class AssignStickerAndApproveVehicleApplicationUseCase extends ProtectedUseCase<
  UpdateVehicleApplicationStickerRequest,
  IVehicleApplicationDTO
> {
  protected _ALLOWED_ACCESS_ROLES = ["SECURITY", "CASHIER", "ADMIN", "SUPERADMIN"];
  private _vehicleApplicationRepository: IVehicleApplicationRepository;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;
  private _vehicleService: IVehicleService;
  private _userService: IUserService;
  private _auditLogService: IAuditLogService;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper: IVehicleApplicationMapper = new VehicleApplicationMapper(),
    vehicleService: IVehicleService = new VehicleService(),
    userService: IUserService = new UserService(),
    auditLogService: IAuditLogService = new AuditLogService()
  ) {
    super();
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
    this._vehicleService = vehicleService;
    this._userService = userService;
    this._auditLogService = auditLogService;
  }

  public async executeImplementation({
    vehicleApplicationId,
    stickerNumber,
    actorId
  }: UpdateVehicleApplicationStickerRequest & UseCaseActorInfo): Promise<IVehicleApplicationDTO> {
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
    await this._createAuditLog({
      actorId,
      objectId: vehicleApplication.id,
      stickerNumber: stickerNumber
    });

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
      images: {
        front: vehicleApplication.vehicle.frontImage,
        side: vehicleApplication.vehicle.sideImage,
        back: vehicleApplication.vehicle.backImage,
        receipt: vehicleApplication.vehicle.officialReceipt,
        registration: vehicleApplication.vehicle.certificateOfRegistration
      },
      driver: {
        lastName: vehicleApplication.driver.lastName,
        firstName: vehicleApplication.driver.firstName,
        licenseId: vehicleApplication.driver.licenseId,
        licenseImage: vehicleApplication.driver.licenseImage,
        selfiePicture: vehicleApplication.driver.selfiePicture
      },
      schoolMember: {
        schoolId: vehicleApplication.schoolMember.schoolId,
        lastName: vehicleApplication.schoolMember.lastName,
        firstName: vehicleApplication.schoolMember.firstName,
        type: vehicleApplication.schoolMember.type,
        schoolCredential: vehicleApplication.schoolMember.schoolCredential
      },
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
      await this._vehicleApplicationRepository.updateVehicleApplication(vehicleApplication);
    if (!savedVehicleApplication) {
      throw new UnexpectedError("Failed to update Vehicle Application sticker");
    }

    return savedVehicleApplication;
  }

  private async _createAuditLog({
    actorId,
    objectId,
    stickerNumber
  }: { actorId: string; objectId: string; stickerNumber: string }): Promise<void> {
    await this._auditLogService.createAndSaveAuditLog({
      actionType: "UPDATE",
      actorId: actorId,
      objectId: objectId,
      details: `Approved the application and assigned vehicle sticker: ${stickerNumber}`
    });
  }
}
