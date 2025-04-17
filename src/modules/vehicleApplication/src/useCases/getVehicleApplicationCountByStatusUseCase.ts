import { ProtectedUseCase } from "../../../../shared/domain/useCase";
import type { UseCaseActorInfo } from "../../../../shared/lib/types";
import type { VehicleApplicationCountByStatus } from "../dtos/vehicleApplicationDTO";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../repositories/vehicleApplicationRepository";

export class GetVehicleApplicationCountByStatusUseCase extends ProtectedUseCase<
  { status?: string },
  VehicleApplicationCountByStatus
> {
  protected _ALLOWED_ACCESS_ROLES: string[] = ["SECURITY", "CASHIER", "ADMIN", "SUPERADMIN"];
  private _vehicleApplicationRepository: IVehicleApplicationRepository;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository()
  ) {
    super();
    this._vehicleApplicationRepository = vehicleApplicationRepository;
  }

  public async executeImplementation(
    params: { status?: string } & UseCaseActorInfo
  ): Promise<VehicleApplicationCountByStatus> {
    return await this._getVehicleApplicationCountByStatus(params.status);
  }

  private async _getVehicleApplicationCountByStatus(
    statusFilter?: string
  ): Promise<VehicleApplicationCountByStatus> {
    return this._vehicleApplicationRepository.getVehicleApplicationCountByStatus(statusFilter);
  }
}
