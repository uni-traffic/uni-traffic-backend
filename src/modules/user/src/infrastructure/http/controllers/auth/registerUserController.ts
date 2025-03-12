import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../../shared/lib/jsonWebToken";
import type { IUserDTO } from "../../../../dtos/userDTO";
import type { RegisterRequest } from "../../../../dtos/userRequestSchema";
import { type IUserRoleService, UserRoleService } from "../../../../shared/service/userRoleService";
import { RegisterUserUseCase } from "../../../../useCases/auth/registerUserUseCase";

export class RegisterUserController extends BaseController {
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: IUserRoleService;
  private _registerUserUseCase: RegisterUserUseCase;

  public constructor(
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService(),
    registerUserUseCase = new RegisterUserUseCase()
  ) {
    super();
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
    this._registerUserUseCase = registerUserUseCase;
  }

  protected async executeImpl(req: Request, res: Response) {
    await this._verifyPermission(req);

    const requestBody: RegisterRequest = req.body;
    const user = await this._registerUserUseCase.execute(requestBody);

    this.created<IUserDTO>(res, "User successfully created.", user);
  }

  private async _verifyPermission(req: Request) {
    const accessToken = this._getAccessToken(req);
    const { id } = this._jsonWebToken.verify<{ id: string }>(accessToken);
    const hasAdminRole = await this._userRoleService.hasAdminRole(id);
    if (!hasAdminRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }
  }
}
