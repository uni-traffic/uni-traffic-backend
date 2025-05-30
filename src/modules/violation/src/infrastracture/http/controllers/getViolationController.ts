import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { GetViolationResponse } from "../../../dtos/violationDTO";
import type { GetViolationRequest } from "../../../dtos/violationRequestSchema";
import { GetViolationUseCase } from "../../../useCases/getViolationUseCase";

export class GetViolationController extends BaseController {
  private _getViolationsUseCase: GetViolationUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getViolationsUseCase = new GetViolationUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getViolationsUseCase = getViolationsUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response) {
    await this._verifyPermission(req);

    const requestParams = req.query as GetViolationRequest;
    const result = await this._getViolationsUseCase.execute(requestParams);

    this.ok<GetViolationResponse>(res, result);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: userId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasStaffRoles = await this._userRoleService.hasGivenRoles(userId, [
      "SUPERADMIN",
      "ADMIN",
      "SECURITY"
    ]);
    if (!hasStaffRoles) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return userId;
  }
}
