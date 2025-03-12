import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../../shared/lib/jsonWebToken";
import type { IUserDTO } from "../../../../dtos/userDTO";
import type { UpdateRoleRequest } from "../../../../dtos/userRequestSchema";
import { type IUserRoleService, UserRoleService } from "../../../../shared/service/userRoleService";
import { UpdateUserRoleUseCase } from "../../../../useCases/user/updateUserRoleUseCase";

export class UpdateUserRoleController extends BaseController {
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: IUserRoleService;
  private _updateUserRoleUseCase: UpdateUserRoleUseCase;

  public constructor(
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService(),
    updateUserRoleUseCase = new UpdateUserRoleUseCase()
  ) {
    super();
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
    this._updateUserRoleUseCase = updateUserRoleUseCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const requestBody = req.body as UpdateRoleRequest;
    const updatedUser = await this._updateUserRoleUseCase.execute(requestBody);

    this.ok<IUserDTO>(res, updatedUser);
  }

  private async _verifyPermission(req: Request) {
    const accessToken = this._getAccessToken(req);
    const { id } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasSuperAdminRole = await this._userRoleService.hasGivenRoles(id, ["SUPERADMIN"]);
    if (hasSuperAdminRole) {
      return true;
    }
    if (!hasSuperAdminRole && (req.body as UpdateRoleRequest).role.toUpperCase() === "ADMIN") {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    const hasAdminRole = await this._userRoleService.hasAdminRole(id);
    if (!hasAdminRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }
  }
}
