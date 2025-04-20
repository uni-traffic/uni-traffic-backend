import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { GetVehicleResponse } from "../../../dtos/vehicleDTO";
import type { GetVehicleRequest } from "../../../dtos/vehicleRequestSchema";
import { GetVehicleUseCase } from "../../../useCases/getVehicleUseCase";

export class GetVehicleController extends BaseController {
  private _getVehicleUseCase: GetVehicleUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getVehicleUseCase = new GetVehicleUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getVehicleUseCase = getVehicleUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const result = await this._getVehicleUseCase.execute(req.query as GetVehicleRequest);

    this.ok<GetVehicleResponse>(res, result);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const requestQuery = req.query as GetVehicleRequest;
    const hasRequiredRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "ADMIN",
      "SUPERADMIN",
      "CASHIER",
      "SECURITY"
    ]);
    if (!hasRequiredRole && requestQuery.ownerId !== tokenUserId) {
      throw new ForbiddenError("You do not have required permission to perform this action.");
    }

    return tokenUserId;
  }
}
