import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { UpdateVehicleApplicationStickerUseCase } from "../../../useCases/updateVehicleApplicationStickerUseCase";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { JSONWebToken, type IJSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import {
  type IUserRoleService,
  UserRoleService
} from "../../../../../user/src/shared/service/userRoleService";
import type { UpdateVehicleApplicationStickerRequest } from "../../../dtos/vehicleApplicationRequestSchema";
import type { IVehicleApplicationDTO } from "../../../dtos/vehicleApplicationDTO";
import { VehicleApplicationRepository } from "../../../repositories/vehicleApplicationRepository";
import { VehicleApplicationMapper } from "../../../domain/models/vehicleApplication/mapper";

export class UpdateVehicleApplicationStickerController extends BaseController {
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: IUserRoleService;
  private _updateVehicleApplicationStickerUseCase: UpdateVehicleApplicationStickerUseCase;

  public constructor(
    jsonWebtoken = new JSONWebToken(),
    userRoleService = new UserRoleService(),
    vehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper = new VehicleApplicationMapper()
  ) {
    super();
    this._jsonWebToken = jsonWebtoken;
    this._userRoleService = userRoleService;
    this._updateVehicleApplicationStickerUseCase = new UpdateVehicleApplicationStickerUseCase(
      vehicleApplicationRepository,
      vehicleApplicationMapper
    );
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const requestBody = req.body as UpdateVehicleApplicationStickerRequest;
    const updatedVehicleApplicationDTO =
      await this._updateVehicleApplicationStickerUseCase.execute(requestBody);

    this.ok<IVehicleApplicationDTO>(res, updatedVehicleApplicationDTO);
  }

  private async _verifyPermission(req: Request) {
    const accessToken = this._getAccessToken(req);
    const { id } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasGivenRoles = await this._userRoleService.hasGivenRoles(id, [
      "ADMIN",
      "SUPERADMIN",
      "CASHIER"
    ]);

    if (!hasGivenRoles) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return id;
  }
}
