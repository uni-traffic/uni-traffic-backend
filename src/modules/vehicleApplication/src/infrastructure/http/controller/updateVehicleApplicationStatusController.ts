import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import {
  type IUserRoleService,
  UserRoleService
} from "../../../../../user/src/shared/service/userRoleService";
import { UpdateVehicleApplicationStatusUseCase } from "../../../useCases/updateVehicleApplicationStatusUseCase";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import type { UpdateVehicleApplicationStatusRequest } from "../../../dtos/vehicleApplicationRequestSchema";
import type { IVehicleApplicationDTO } from "../../../dtos/vehicleApplicationDTO";

export class UpdateVehicleApplicationStatusController extends BaseController {
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: IUserRoleService;
  private _updateVehicleApplicationStatusUseCase: UpdateVehicleApplicationStatusUseCase;

  public constructor(
    jsonWebtoken = new JSONWebToken(),
    userRoleService = new UserRoleService(),
    updateVehicleApplicationStatus = new UpdateVehicleApplicationStatusUseCase()
  ) {
    super();
    this._jsonWebToken = jsonWebtoken;
    this._userRoleService = userRoleService;
    this._updateVehicleApplicationStatusUseCase = updateVehicleApplicationStatus;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const requestBody = req.body as UpdateVehicleApplicationStatusRequest;
    const updatedVehicleApplication =
      await this._updateVehicleApplicationStatusUseCase.execute(requestBody);

    this.ok<IVehicleApplicationDTO>(res, updatedVehicleApplication);
  }

  private async _verifyPermission(req: Request) {
    const accessToken = this._getAccessToken(req);
    const { id } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasGivenRoles = await this._userRoleService.hasGivenRoles(id, [
      "ADMIN",
      "SUPERADMIN",
      "CASHIER",
      "SECURITY"
    ]);

    if (!hasGivenRoles) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return id;
  }
}
