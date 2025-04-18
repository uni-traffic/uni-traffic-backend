import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../shared/core/errors";
import { BaseController } from "../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../user/src/shared/service/userRoleService";
import type {
  GetTotalViolationGivenByGivenRange,
  ViolationRecordGetRequest
} from "../../../../violationRecord/src/dtos/violationRecordRequestSchema";
import type { TotalUniqueSignInByGivenRange } from "../../dtos/userSignInActivityDTO";
import { GetTotalUniqueSignInByGivenRangeUseCase } from "../../useCases/getTotalUniqueSignInByGivenRangeUseCase";

export class GetTotalUniqueSignInByGivenRangeController extends BaseController {
  private _getTotalUniqueSignInByGivenRangeUseCase: GetTotalUniqueSignInByGivenRangeUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getTotalUniqueSignInByGivenRangeUseCase = new GetTotalUniqueSignInByGivenRangeUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getTotalUniqueSignInByGivenRangeUseCase = getTotalUniqueSignInByGivenRangeUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const actorId = await this._verifyPermission(req);

    const requestQuery = req.query as GetTotalViolationGivenByGivenRange;
    const totalUniqueSignInByGivenRange =
      await this._getTotalUniqueSignInByGivenRangeUseCase.execute({
        ...requestQuery,
        actorId: actorId
      });

    this.ok<TotalUniqueSignInByGivenRange>(res, totalUniqueSignInByGivenRange);
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
