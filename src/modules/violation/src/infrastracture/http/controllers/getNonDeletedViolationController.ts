import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { IViolationDTO } from "../../../dtos/violationDTO";
import { GetNonDeletedViolationUseCase } from "../../../useCases/getNonDeletedViolationUseCase";

export class GetNonDeletedViolationController extends BaseController {
  private _getNonDeletedViolationUseCase: GetNonDeletedViolationUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getViolationsUseCase = new GetNonDeletedViolationUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getNonDeletedViolationUseCase = getViolationsUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response) {
    await this._verifyPermission(req);

    const violationsDTO = await this._getNonDeletedViolationUseCase.execute();

    this.ok<IViolationDTO[]>(res, violationsDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: userId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasAdminRole = await this._userRoleService.hasAdminRole(userId);
    const hasSecurityRole = await this._userRoleService.hasSecurityRole(userId);
    if (!hasAdminRole && !hasSecurityRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return userId;
  }
}
