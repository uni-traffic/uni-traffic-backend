import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../shared/service/userRoleService";
import { GetUserByPropertyUseCase } from "../../../useCases/user/getUserByPropertyUseCase";
import type { GetUserRequest } from "../../../dtos/userRequestSchema";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import type { IUserDTO } from "../../../dtos/userDTO";

export class GetUserInformationController extends BaseController {
  private _getUserByProperty: GetUserByPropertyUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getUserByProperty = new GetUserByPropertyUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getUserByProperty = getUserByProperty;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const userDetailsDTO = await this._getUserByProperty.execute(
      req.query as GetUserRequest
    );

    this.ok<IUserDTO[]>(res, userDetailsDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasAdminRole = await this._userRoleService.hasAdminRole(tokenUserId);

    if (!hasAdminRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return tokenUserId;
  }
}
