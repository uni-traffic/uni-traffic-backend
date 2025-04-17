import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { VehicleApplicationCountByStatus } from "../../../dtos/vehicleApplicationDTO";
import type {
  GetVehicleApplicationCountByStatusRequest,
  VehicleApplicationGetRequest
} from "../../../dtos/vehicleApplicationRequestSchema";
import { GetVehicleApplicationCountByStatusUseCase } from "../../../useCases/getVehicleApplicationCountByStatusUseCase";

export class VehicleApplicationCountByStatusController extends BaseController {
  private _getVehicleApplicationCountByStatusUseCase: GetVehicleApplicationCountByStatusUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getVehicleApplicationCountByStatusUseCase = new GetVehicleApplicationCountByStatusUseCase(),
    jsonWebToken: JSONWebToken = new JSONWebToken(),
    userRoleService: UserRoleService = new UserRoleService()
  ) {
    super();
    this._getVehicleApplicationCountByStatusUseCase = getVehicleApplicationCountByStatusUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const userId = await this._verifyPermission(req);

    const requestQuery = req.query as GetVehicleApplicationCountByStatusRequest;
    const vehicleApplicationCountByStatus =
      await this._getVehicleApplicationCountByStatusUseCase.execute({
        ...requestQuery,
        actorId: userId
      });

    this.ok<VehicleApplicationCountByStatus>(res, vehicleApplicationCountByStatus);
  }

  private async _verifyPermission(req: Request): Promise<string> {
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
