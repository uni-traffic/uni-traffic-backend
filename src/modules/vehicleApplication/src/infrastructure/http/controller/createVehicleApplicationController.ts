import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { VehicleApplicationCreateRequest } from "../../../dtos/vehicleApplicationRequestSchema";
import { CreateVehicleApplicationUseCase } from "../../../useCases/createVehicleApplicationUseCase";

export class CreateVehicleApplicationController extends BaseController {
  private _createVehicleApplicationUseCase: CreateVehicleApplicationUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getVehicleApplicationByPropertyUseCase: CreateVehicleApplicationUseCase = new CreateVehicleApplicationUseCase(),
    jsonWebToken: JSONWebToken = new JSONWebToken(),
    userRoleService: UserRoleService = new UserRoleService()
  ) {
    super();
    this._createVehicleApplicationUseCase = getVehicleApplicationByPropertyUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const applicantId = await this._verifyPermission(req);
    const requestBody = req.body as VehicleApplicationCreateRequest;

    const vehicleApplicationDTO = await this._createVehicleApplicationUseCase.execute({
      ...requestBody,
      applicantId
    });

    this.created(res, "Vehicle Application Submitted", vehicleApplicationDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasRequiredRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "STUDENT",
      "STAFF",
      "GUEST"
    ]);
    if (!hasRequiredRole) {
      throw new ForbiddenError("You do not have required permission to perform this action.");
    }

    return tokenUserId;
  }
}
