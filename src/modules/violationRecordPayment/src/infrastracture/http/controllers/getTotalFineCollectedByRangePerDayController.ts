import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import { GetTotalFineCollectedPerDayByRangeUseCase } from "../../../useCases/getTotalFineCollectedByRangePerDayUseCase";
import type { GetTotalFineCollectedPerDayByRangeUseCasePayload } from "../../../dtos/violationRecordPaymentDTO";

export class GetTotalFineCollectedPerDayByRangeController extends BaseController {
  private _getTotalFineCollectedPerDayByRangeUseCase: GetTotalFineCollectedPerDayByRangeUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getTotalFineCollectedPerDayByRangeUseCase = new GetTotalFineCollectedPerDayByRangeUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._getTotalFineCollectedPerDayByRangeUseCase = getTotalFineCollectedPerDayByRangeUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response) {
    await this._verifyPermission(req);
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };

    const requestBody: GetTotalFineCollectedPerDayByRangeUseCasePayload = {
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };

    const violationRecordPaymentDetailsDTO =
      await this._getTotalFineCollectedPerDayByRangeUseCase.execute(requestBody);

    this.ok(res, violationRecordPaymentDetailsDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasCashierRole = await this._userRoleService.hasGivenRoles(tokenUserId, [
      "SUPERADMIN",
      "CASHIER",
      "ADMIN",
      "SECURITY"
    ]);

    if (!hasCashierRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return tokenUserId;
  }
}
