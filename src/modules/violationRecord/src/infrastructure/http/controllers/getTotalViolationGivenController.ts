import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { ViolationsGivenPerDayByRange } from "../../../dtos/violationRecordRequestSchema";
import { GetViolationsGivenByDateRange } from "../../../useCases/getViolationsGivenByDateRangeUseCase";

export class GetTotalViolationGivenController extends BaseController {
  private _getTotalViolationGivenUseCase: GetViolationsGivenByDateRange;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getTotalViolationGivenUseCase = new GetViolationsGivenByDateRange(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getTotalViolationGivenUseCase = getTotalViolationGivenUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const params = req.query as ViolationsGivenPerDayByRange;
    const result = await this._getTotalViolationGivenUseCase.execute(params);

    const formattedResult = result.map((entry) => ({
      date: entry.date.toISOString().split("T")[0],
      violationsIssued: entry.violationsIssued
    }));

    this.ok(res, formattedResult);
  }

  private async _verifyPermission(req: Request): Promise<void> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasRequiredRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "ADMIN",
      "SUPERADMIN",
      "SECURITY"
    ]);

    if (!hasRequiredRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }
  }
}
