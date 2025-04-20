import { NotFoundError } from "../../../../shared/core/errors";
import type { IVehicle } from "../domain/models/vehicle/classes/vehicle";
import { type IVehicleMapper, VehicleMapper } from "../domain/models/vehicle/mapper";
import type { GetVehicleParams, GetVehicleResponse } from "../dtos/vehicleDTO";
import type { GetVehicleRequest } from "../dtos/vehicleRequestSchema";
import { type IVehicleRepository, VehicleRepository } from "../repositories/vehicleRepository";

export class GetVehicleUseCase {
  private _vehicleRepository: IVehicleRepository;
  private _vehicleMapper: IVehicleMapper;

  public constructor(
    vehicleRepository: IVehicleRepository = new VehicleRepository(),
    vehicleMapper: IVehicleMapper = new VehicleMapper()
  ) {
    this._vehicleRepository = vehicleRepository;
    this._vehicleMapper = vehicleMapper;
  }

  public async execute(params: GetVehicleRequest): Promise<GetVehicleResponse> {
    const refinedParams = this._refineParams(params);
    const vehicles = await this._getVehicles(refinedParams);
    const totalVehicles = await this._getTotalVehicle(refinedParams);
    const totalPages = this._getTotalPages(refinedParams.count, totalVehicles);
    const hasNextPage = this._hasNextPage(refinedParams.count, refinedParams.page, totalVehicles);

    return {
      vehicles: vehicles.map((vehicle) => this._vehicleMapper.toDTO(vehicle)),
      hasNextPage: hasNextPage,
      hasPreviousPage: refinedParams.page > 1,
      totalPages: totalPages
    };
  }

  private _refineParams(params: GetVehicleRequest): GetVehicleParams {
    return {
      ...params,
      sort: params.sort ? (params.sort === "1" ? 1 : 2) : params.sort,
      count: Number(params.count),
      page: Number(params.page)
    };
  }

  private async _getVehicles(params: GetVehicleParams): Promise<IVehicle[]> {
    const vehicles = await this._vehicleRepository.getVehicles(params);
    if (vehicles.length < 1) {
      throw new NotFoundError("No Vehicle found");
    }

    return vehicles;
  }

  private _getTotalVehicle(params: GetVehicleParams): Promise<number> {
    return this._vehicleRepository.countTotalVehicles(params);
  }

  private _hasNextPage(count: number, page: number, totalVehicles: number): boolean {
    return count * page < totalVehicles;
  }

  private _getTotalPages(countPerPage: number, totalVehicles: number): number {
    return Math.ceil(totalVehicles / countPerPage);
  }
}
