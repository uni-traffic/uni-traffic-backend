import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import { GetTotalViolationGiven } from "../../../useCases/getTotalViolationGivenUseCase";

export class GetTotalViolationGivenController extends BaseController {
  private _getTotalViolationGivenUseCase: GetTotalViolationGiven;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getTotalViolationGivenUseCase = new GetTotalViolationGiven(),
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

    const { start, end } = req.query;
    const startDate = new Date(start as string);
    const endDate = new Date(end as string);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const result = await this._getTotalViolationGivenUseCase.execute({
      start: startDate,
      end: endDate,
    });

    const formattedResult = result.map((entry) => ({
      date: entry.date.toISOString().split("T")[0],
      violationsIssued: entry.violationsIssued,
    }));

    this.ok(res, formattedResult);
  }

  private async _verifyPermission(req: Request): Promise<void> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasRequiredRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "ADMIN",
      "SUPERADMIN",
    ]);

    if (!hasRequiredRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }
  }
}
