import { NotFoundError, ForbiddenError } from "../../../../shared/core/errors";
import type { IVehicleRepository } from "../repositories/vehicleRepository";
import { VehicleRepository } from "../repositories/vehicleRepository";
import type { IVehicleDTO } from "../dtos/vehicleDTO";
import { VehicleMapper } from "../domain/models/vehicle/mapper";
import type { IUserRoleService } from "../../../user/src/shared/service/userRoleService";
import { UserRoleService } from "../../../user/src/shared/service/userRoleService";

export class GetVehicleInformationUseCase {
  private _vehicleRepository: IVehicleRepository;
  private _vehicleMapper: VehicleMapper;
  private _userRoleService: IUserRoleService;

  public constructor(
    vehicleRepository: IVehicleRepository = new VehicleRepository(),
    vehicleMapper: VehicleMapper = new VehicleMapper(),
    userRoleService: IUserRoleService = new UserRoleService()
  ) {
    this._vehicleRepository = vehicleRepository;
    this._vehicleMapper = vehicleMapper;
    this._userRoleService = userRoleService;
  }

  public async execute(vehicleId: string, userId: string): Promise<IVehicleDTO> {
    const vehicleOrNull = await this._vehicleRepository.getVehicleById(vehicleId);
    if (!vehicleOrNull) {
      throw new NotFoundError("Vehicle not found.");
    }

    // 🔹 Check if user has either ADMIN or SECURITY role
    const hasPermission =
      (await this._userRoleService.hasAdminRole(userId)) ||
      (await this._userRoleService.hasSecurityRole(userId));

    if (!hasPermission) {
      throw new ForbiddenError("You do not have the required permissions to view this vehicle.");
    }

    return this._vehicleMapper.toDTO(vehicleOrNull);
  }
}
