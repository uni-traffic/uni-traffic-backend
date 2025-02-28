import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import { GetViolationRecordInformationUseCase } from "../../../useCases/getViolationRecordUseCase";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import type { IViolationRecordDTO } from "../../../dtos/violationRecordDTO";

export class GetViolationRecordController extends BaseController {
  private _getViolationRecordInformationUseCase: GetViolationRecordInformationUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getViolationRecordUseCase = new GetViolationRecordInformationUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getViolationRecordInformationUseCase = getViolationRecordUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const violationRecordDTO = await this._getViolationRecordInformationUseCase.execute(req.query);

    this.ok<IViolationRecordDTO>(res, violationRecordDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasAdminRole = await this._userRoleService.hasAdminRole(tokenUserId);
    const hasSecurityRole = await this._userRoleService.hasSecurityRole(tokenUserId);

    const requestedUserId =
      ((req.params.userId || req.query.userId) as string | undefined) || tokenUserId;

    if (!hasAdminRole && !hasSecurityRole) {
      if (requestedUserId !== tokenUserId) {
        throw new ForbiddenError("You can only access your own violation records.");
      }
    }

    return tokenUserId;
  }
}
