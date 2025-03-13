import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { ViolationRecordAuditLogGetRequest } from "../../../dtos/violationRecordAuditLogRequestSchema";
import { GetViolationRecordAuditLogByPropertyUseCase } from "../../../useCases/getViolationRecordAuditLogByPropertyUseCase";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import type { IViolationRecordAuditLogDTO } from "../../../dtos/violationRecordAuditLogDTO";

export class GetViolationRecordAuditLogController extends BaseController {
  private _getViolationRecordAuditLogByPropertyUseCase: GetViolationRecordAuditLogByPropertyUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getViolationRecordAuditLogByPropertyUseCase = new GetViolationRecordAuditLogByPropertyUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getViolationRecordAuditLogByPropertyUseCase = getViolationRecordAuditLogByPropertyUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const violationRecordAuditLogDTO =
      await this._getViolationRecordAuditLogByPropertyUseCase.execute(
        req.query as ViolationRecordAuditLogGetRequest
      );

    this.ok<IViolationRecordAuditLogDTO[]>(res, violationRecordAuditLogDTO);
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
