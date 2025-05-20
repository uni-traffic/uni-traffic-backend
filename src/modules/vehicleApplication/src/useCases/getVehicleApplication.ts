import { NotFoundError } from "../../../../shared/core/errors";
import type { IVehicleApplication } from "../domain/models/vehicleApplication/classes/vehicleApplication";
import {
  type IVehicleApplicationMapper,
  VehicleApplicationMapper
} from "../domain/models/vehicleApplication/mapper";
import type {
  GetVehicleApplicationResponse,
  GetViolationVehicle
} from "../dtos/vehicleApplicationDTO";
import type { VehicleApplicationGetRequest } from "../dtos/vehicleApplicationRequestSchema";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

export class GetVehicleApplication {
  private _vehicleApplicationRepository: IVehicleApplicationRepository;
  private _vehicleApplicationMapper: IVehicleApplicationMapper;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper: IVehicleApplicationMapper = new VehicleApplicationMapper()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationMapper = vehicleApplicationMapper;
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
      vehicleApplication: vehicleApplicationDetails.map((vehicleApplication) =>
        this._vehicleApplicationMapper.toDTO(vehicleApplication)
      ),
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
}
