import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { GetVehicleInformationUseCase } from "../../../useCases/getVehicleInformationUseCase";
import type { IVehicleDTO } from "../../../dtos/vehicleDTO";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";

export class GetVehicleInformationController extends BaseController {
  private _getVehicleInformationUseCase: GetVehicleInformationUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getVehicleInformationUseCase = new GetVehicleInformationUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getVehicleInformationUseCase = getVehicleInformationUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response) {
    const userId = await this._verifyPermission(req);
    const vehicleId = req.params.vehicleId;

    const vehicleDTO = await this._getVehicleInformationUseCase.execute(vehicleId, userId);

    this.ok<IVehicleDTO>(res, vehicleDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: userId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasAdminRole = await this._userRoleService.hasAdminRole(userId);
    const hasSecurityRole = await this._userRoleService.hasSecurityRole(userId);

    if (!hasAdminRole && !hasSecurityRole) {
      throw new ForbiddenError(
        "You do not have the required permissions to access vehicle information."
      );
    }

    return userId;
  }
}
