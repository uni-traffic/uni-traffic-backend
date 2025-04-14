import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import {
  type IUserRoleService,
  UserRoleService
} from "../../../../../user/src/shared/service/userRoleService";
import { VehicleApplicationMapper } from "../../../domain/models/vehicleApplication/mapper";
import type { IVehicleApplicationDTO } from "../../../dtos/vehicleApplicationDTO";
import type { UpdateVehicleApplicationStickerRequest } from "../../../dtos/vehicleApplicationRequestSchema";
import { VehicleApplicationRepository } from "../../../repositories/vehicleApplicationRepository";
import { AssignStickerAndApproveVehicleApplicationUseCase } from "../../../useCases/assignStickerAndApproveVehicleApplicationUseCase";

export class UpdateVehicleApplicationStickerController extends BaseController {
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: IUserRoleService;
  private _updateVehicleApplicationStickerUseCase: AssignStickerAndApproveVehicleApplicationUseCase;

  public constructor(
    jsonWebtoken = new JSONWebToken(),
    userRoleService = new UserRoleService(),
    vehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationMapper = new VehicleApplicationMapper()
  ) {
    super();
    this._jsonWebToken = jsonWebtoken;
    this._userRoleService = userRoleService;
    this._updateVehicleApplicationStickerUseCase =
      new AssignStickerAndApproveVehicleApplicationUseCase(
        vehicleApplicationRepository,
        vehicleApplicationMapper
      );
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const userId = await this._verifyPermission(req);

    const requestBody = req.body as UpdateVehicleApplicationStickerRequest;
    const updatedVehicleApplicationDTO = await this._updateVehicleApplicationStickerUseCase.execute(
      { ...requestBody, actorId: userId }
    );

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
