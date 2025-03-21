import { NotFoundError } from "../../../../shared/core/errors";
import { FileService, type IFileService } from "../../../file/src/service/fileService";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type {
  GetViolationVehicleByProperty,
  IVehicleApplicationDTO,
  IVehicleApplicationLinks
} from "../dtos/vehicleApplicationDTO";
import type { VehicleApplicationGetRequest } from "../dtos/vehicleApplicationRequestSchema";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

export class GetVehicleApplicationByPropertyUseCase {
  private _vehicleApplicationRepository: IVehicleApplicationRepository;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;
  private _fileService: IFileService;

  public constructor(
    fileService: IFileService = new FileService(),
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper: IVehicleApplicationMapper = new VehicleApplicationMapper()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
    this._fileService = fileService;
  }

  public async execute(payload: VehicleApplicationGetRequest): Promise<IVehicleApplicationDTO[]> {
    const refinedPayload = this._refineRequestPayload(payload);
    const vehicleApplicationDetails = await this._getVehicleApplicationByProperty(refinedPayload);

    return await this._convertToDTO(vehicleApplicationDetails);
  }

  private async _getVehicleApplicationByProperty(
    payload: GetViolationVehicleByProperty
  ): Promise<IVehicleApplication[]> {
    const vehicleApplicationDetails =
      await this._vehicleApplicationRepository.getVehicleApplicationByProperty(payload);
    if (!vehicleApplicationDetails || vehicleApplicationDetails.length === 0) {
      throw new NotFoundError("Vehicle Application not found");
    }

    return vehicleApplicationDetails;
  }

  private _refineRequestPayload(
    payload: VehicleApplicationGetRequest
  ): GetViolationVehicleByProperty {
    return {
      id: payload.id,
      schoolId: payload.schoolId,
      userType: payload.userType,
      driverLicenseId: payload.driverLicenseId,
      licensePlate: payload.licensePlate,
      status: payload.status,
      applicantId: payload.applicantId,
      count: Number(payload.count),
      page: Number(payload.page)
    };
  }

  private async _getSignedUrlForFiles(payload: IVehicleApplicationLinks) {
    const keys = Object.keys(payload);
    const urls = await Promise.all(
      Object.values(payload).map((value) => this._fileService.getSignedUrl(value))
    );

    return keys.reduce(
      (acc, key, index) => {
        acc[key] = urls[index].signedUrl;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  private async _convertToDTO(
    vehicleApplications: IVehicleApplication[]
  ): Promise<IVehicleApplicationDTO[]> {
    const signedUrlsPromises = vehicleApplications.map((vehicleApplication) =>
      this._getSignedUrlForFiles({
        schoolCredential: vehicleApplication.schoolMember.schoolCredential,
        licenseImage: vehicleApplication.driver.licenseImage,
        officialReceipt: vehicleApplication.vehicle.officialReceipt,
        certificateOfRegistration: vehicleApplication.vehicle.certificateOfRegistration,
        frontImage: vehicleApplication.vehicle.frontImage,
        backImage: vehicleApplication.vehicle.backImage,
        sideImage: vehicleApplication.vehicle.sideImage
      })
    );

    const signedUrlsArray = await Promise.all(signedUrlsPromises);

    return vehicleApplications.map((vehicleApplication, index) => {
      const signedApplicationLinks = signedUrlsArray[index];
      const applicationDTO = this._vehicleApplicationMapper.toDTO(vehicleApplication);

      return {
        ...applicationDTO,
        schoolMember: {
          ...applicationDTO.schoolMember,
          schoolCredential: signedApplicationLinks.schoolCredential
        },
        driver: {
          ...applicationDTO.driver,
          licenseImage: signedApplicationLinks.licenseImage
        },
        vehicle: {
          ...applicationDTO.vehicle,
          frontImage: signedApplicationLinks.frontImage,
          backImage: signedApplicationLinks.backImage,
          sideImage: signedApplicationLinks.sideImage,
          officialReceipt: signedApplicationLinks.officialReceipt,
          certificateOfRegistration: signedApplicationLinks.certificateOfRegistration
        }
      };
    });
  }
}
