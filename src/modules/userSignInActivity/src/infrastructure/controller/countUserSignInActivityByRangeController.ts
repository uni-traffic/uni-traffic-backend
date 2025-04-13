import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../shared/core/errors";
import { BaseController } from "../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../user/src/shared/service/userRoleService";
import type { UserSignInActivityByRangeRequest } from "../../dtos/userSignInActivityRequestSchema";
import { CountUserSignInActivityByRangeUseCase } from "../../useCases/countUserSignInActivityByRangeUseCase";

export class CountUserSignInActivityByRangeController extends BaseController {
  private _countUserSignInActivityByRangeUseCase: CountUserSignInActivityByRangeUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    countUserSignInActivityByRangeUseCase: CountUserSignInActivityByRangeUseCase = new CountUserSignInActivityByRangeUseCase(),
    jsonWebToken: JSONWebToken = new JSONWebToken(),
    userRoleService: UserRoleService = new UserRoleService()
  ) {
    super();
    this._countUserSignInActivityByRangeUseCase = countUserSignInActivityByRangeUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const result = await this._countUserSignInActivityByRangeUseCase.execute(
      req.query as UserSignInActivityByRangeRequest
    );

    this.ok<{ count: number }>(res, result);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasRequiredRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "ADMIN",
      "SUPERADMIN"
    ]);
    if (!hasRequiredRole) {
      throw new ForbiddenError("You do not have required permission to perform this action.");
    }

    return tokenUserId;
  }
}
