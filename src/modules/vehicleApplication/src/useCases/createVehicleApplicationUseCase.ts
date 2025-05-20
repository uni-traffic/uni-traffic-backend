import {
  BadRequest,
  ForbiddenError,
  NotFoundError,
  UnexpectedError
} from "../../../../shared/core/errors";
import { uniTrafficId } from "../../../../shared/lib/uniTrafficId";
import { FileService, type IFileService } from "../../../file/src/service/fileService";
import {
  type IVehicleRepository,
  VehicleRepository
} from "../../../vehicle/src/repositories/vehicleRepository";
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

export class CreateVehicleApplicationUseCase {
  private _vehicleApplicationRepository: IVehicleApplicationRepository;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;
  private _fileService: IFileService;
  private _vehicleRepository: IVehicleRepository;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper: IVehicleApplicationMapper = new VehicleApplicationMapper(),
    fileService: IFileService = new FileService(),
    vehicleRepository: IVehicleRepository = new VehicleRepository()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
    this._fileService = fileService;
    this._vehicleRepository = vehicleRepository;
  }

  public async execute(params: IVehicleApplicationProps): Promise<IVehicleApplicationDTO> {
    await this._ensureUserCanCreateVehicleApplication(params.applicantId);

    const sanitizedLicensePlate = this._sanitizeLicensePlate(params.licensePlate);
    await this._ensureLicensePlateIsNotRegisteredToTheSystem(sanitizedLicensePlate);

    const id = uniTrafficId("S");
    const finalParams = await this._moveFilesToApplicationsFolder(id, params);
    const vehicleApplication = this._createVehicleApplicationDomainObject(id, {
      ...finalParams,
      licensePlate: sanitizedLicensePlate
    });
    const saveVehicleApplication = await this._saveVehicleApplication(vehicleApplication);

    return this._vehicleApplicationMapper.toDTO(saveVehicleApplication);
  }

  private async _ensureUserCanCreateVehicleApplication(userId: string): Promise<void> {
    const { count: userExistingApplicationCount } =
      await this._vehicleApplicationRepository.countUserPendingVehicleApplication(userId);
    if (userExistingApplicationCount >= 2) {
      throw new ForbiddenError("Maximum vehicle application reached");
    }
  }

  private _sanitizeLicensePlate(licensePlate: string): string {
    return licensePlate.replace(/[^a-zA-Z0-9]/g, "");
  }

  private async _ensureLicensePlateIsNotRegisteredToTheSystem(licensePlate: string): Promise<void> {
    const vehicle = await this._vehicleRepository.getVehicleByLicensePlate(licensePlate);
    if (vehicle) {
      throw new BadRequest(`License Plate: ${licensePlate} is already registered in the system`);
    }
  }

  private async _moveFilesToApplicationsFolder(
    id: string,
    params: IVehicleApplicationProps
  ): Promise<IVehicleApplicationProps> {
    const fileKeys: (keyof IVehicleApplicationProps)[] = [
      "schoolCredential",
      "driverLicenseImage",
      "driverSelfiePicture",
      "certificateOfRegistration",
      "officialReceipt",
      "frontImage",
      "sideImage",
      "backImage"
    ];

    const moveFilePromises = fileKeys.map(async (key) => {
      const oldPath = params[key] as string;
      if (!oldPath) {
        throw new NotFoundError(`File not found for key: ${key}`);
      }

      const { path: newPath } = await this._fileService.moveFile(
        oldPath,
        `applications/${id}/${key}`
      );

      return { key, newPath };
    });
    const movedFiles = await Promise.all(moveFilePromises);

    return {
      ...params,
      ...Object.fromEntries(movedFiles.map(({ key, newPath }) => [key, newPath]))
    };
  }

  private _createVehicleApplicationDomainObject(
    id: string,
    params: IVehicleApplicationProps
  ): IVehicleApplication {
    const vehicleApplicationOrError = VehicleApplicationFactory.create({
      id: id,
      ...params
    });
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
