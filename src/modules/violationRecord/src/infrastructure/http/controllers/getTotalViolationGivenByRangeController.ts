import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { ViolationGivenByRange } from "../../../dtos/violationRecordDTO";
import type {
  GetTotalViolationGivenByGivenRange,
  ViolationRecordGetRequest
} from "../../../dtos/violationRecordRequestSchema";
import { GetTotalViolationGivenByRangeUseCase } from "../../../useCases/getTotalViolationGivenByRangeUseCase";

export class GetTotalViolationGivenByRangeController extends BaseController {
  private _getTotalViolationGivenByRangeUseCase: GetTotalViolationGivenByRangeUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getTotalViolationGivenByRangeUseCase = new GetTotalViolationGivenByRangeUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getTotalViolationGivenByRangeUseCase = getTotalViolationGivenByRangeUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const actorId = await this._verifyPermission(req);

    const requestQuery = req.query as GetTotalViolationGivenByGivenRange;
    const violationGivenByRange = await this._getTotalViolationGivenByRangeUseCase.execute({
      ...requestQuery,
      actorId: actorId
    });

    this.ok<ViolationGivenByRange>(res, violationGivenByRange);
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
