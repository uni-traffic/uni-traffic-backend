import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { GetViolationRecordResponse } from "../../../dtos/violationRecordDTO";
import type { ViolationRecordGetRequest } from "../../../dtos/violationRecordRequestSchema";
import { GetViolationRecordInformationUseCase } from "../../../useCases/getViolationRecordUseCase";

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

    const violationRecordDTO = await this._getViolationRecordInformationUseCase.execute(
      req.query as ViolationRecordGetRequest
    );

    this.ok<GetViolationRecordResponse>(res, violationRecordDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const requestQuery = req.query as ViolationRecordGetRequest;

    const hasRequiredRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "ADMIN",
      "SUPERADMIN",
      "CASHIER",
      "SECURITY"
    ]);
    if (!hasRequiredRole && requestQuery.userId !== tokenUserId) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return tokenUserId;
  }
}
