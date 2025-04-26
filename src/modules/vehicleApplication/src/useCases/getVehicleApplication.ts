import { NotFoundError } from "../../../../shared/core/errors";
import { FileService, type IFileService } from "../../../file/src/service/fileService";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type {
  GetVehicleApplicationResponse,
  GetViolationVehicle,
  IVehicleApplicationDTO,
  IVehicleApplicationLinks
} from "../dtos/vehicleApplicationDTO";
import type { VehicleApplicationGetRequest } from "../dtos/vehicleApplicationRequestSchema";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

/** TODO:
 * 1. Return an image not found link when failed to create a signed URL's
 * 2. Allow multiple parameters of status; e.g. [APPROVED, REJECTED etc.]
 * 3. Add sort by date param: sort the result by for 1 asc or 2 desc
 * 4. Add a hasNext property on returned object for pagination purposes.
 */

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

  public async execute(
    payload: VehicleApplicationGetRequest
  ): Promise<GetVehicleApplicationResponse> {
    const refinedPayload = this._refineRequestPayload(payload);
    const vehicleApplicationDetails = await this._getVehicleApplication(refinedPayload);
    const totalUserCount = await this._getTotalCount(refinedPayload);
    const totalPages = this._getTotalPages(refinedPayload.count, totalUserCount);
    const hasNextPage = this._hasNextPage(
      refinedPayload.count,
      refinedPayload.page,
      totalUserCount
    );

    return {
      vehicleApplication: await this._convertToDTO(vehicleApplicationDetails),
      hasNextPage,
      hasPreviousPage: refinedPayload.page > 1,
      totalPages
    };
  }

  private async _getVehicleApplication(
    payload: GetViolationVehicle
  ): Promise<IVehicleApplication[]> {
    const vehicleApplicationDetails =
      await this._vehicleApplicationRepository.getVehicleApplication(payload);
    if (!vehicleApplicationDetails || vehicleApplicationDetails.length === 0) {
      throw new NotFoundError("Vehicle Application not found");
    }

    return vehicleApplicationDetails;
  }

  private _refineRequestPayload(payload: VehicleApplicationGetRequest): GetViolationVehicle {
    return {
      ...payload,
      sort: payload.sort ? (payload.sort === "1" ? 1 : 2) : payload.sort,
      count: Number(payload.count),
      page: Number(payload.page)
    };
  }

  private _getTotalCount(params: GetViolationVehicle): Promise<number> {
    return this._vehicleApplicationRepository.getTotalVehicleApplication(params);
  }

  private _hasNextPage(count: number, page: number, totalUserCount: number): boolean {
    return page * count < totalUserCount;
  }

  private _getTotalPages(countPerPage: number, totalUser: number): number {
    return Math.ceil(totalUser / countPerPage);
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
