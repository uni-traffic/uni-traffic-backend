import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import { GetVehicleApplicationByPropertyUseCase } from "../../../useCases/getVehicleApplicationByPropertyUseCase";
import type { VehicleApplicationGetRequest } from "../../../dtos/vehicleApplicationRequestSchema";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import type { IVehicleApplicationDTO } from "../../../dtos/vehicleApplicationDTO";

export class GetVehicleApplicationController extends BaseController {
  private _getVehicleApplicationByPropertyUseCase: GetVehicleApplicationByPropertyUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getVehicleApplicationByPropertyUseCase: GetVehicleApplicationByPropertyUseCase = new GetVehicleApplicationByPropertyUseCase(),
    jsonWebToken: JSONWebToken = new JSONWebToken(),
    userRoleService: UserRoleService = new UserRoleService()
  ) {
    super();
    this._getVehicleApplicationByPropertyUseCase = getVehicleApplicationByPropertyUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const vehicleApplicationDetailsDTO = await this._getVehicleApplicationByPropertyUseCase.execute(
      req.query as VehicleApplicationGetRequest
    );

    this.ok<IVehicleApplicationDTO[]>(res, vehicleApplicationDetailsDTO);
  }

  public async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const requestQuery = req.query as VehicleApplicationGetRequest;

    const hasRequiredRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "ADMIN",
      "SUPERADMIN",
      "CASHIER",
      "SECURITY"
    ]);

    if (!hasRequiredRole && requestQuery.applicantId !== tokenUserId) {
      throw new ForbiddenError("You do not have required permission to perform this action.");
    }

    return tokenUserId;
  }
}
