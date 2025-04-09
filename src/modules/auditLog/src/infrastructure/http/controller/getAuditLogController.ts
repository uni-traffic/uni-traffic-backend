import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { GetAuditLogResponse } from "../../../dtos/auditLogDTO";
import type { GetAuditLogRequest } from "../../../dtos/auditLogRequestSchema";
import { GetAuditLogUseCase } from "../../../useCases/getAuditLogUseCase";

export class GetAuditLogController extends BaseController {
  private _getAuditLogUseCase: GetAuditLogUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getAuditLogUseCase = new GetAuditLogUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getAuditLogUseCase = getAuditLogUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const result = await this._getAuditLogUseCase.execute(req.query as GetAuditLogRequest);

    this.ok<GetAuditLogResponse>(res, result);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasAdminRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "ADMIN",
      "SUPERADMIN"
    ]);
    if (!hasAdminRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return tokenUserId;
  }
}
