import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { ViolationRecordPaymentRequest } from "../../../dtos/violationRecordPaymentRequestSchema";
import { AddViolationRecordPaymentUseCase } from "../../../useCases/addViolationRecordPaymentUseCase";

export class AddViolationRecordPaymentController extends BaseController {
  private _addViolationRecordPaymentUseCase: AddViolationRecordPaymentUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    addViolationRecordPaymentUseCase = new AddViolationRecordPaymentUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._addViolationRecordPaymentUseCase = addViolationRecordPaymentUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response) {
    const cashierId = await this._verifyPermission(req);
    const requestBody = req.body as ViolationRecordPaymentRequest;

    const paymentDTO = await this._addViolationRecordPaymentUseCase.execute(
      {
        violationRecordId: requestBody.violationRecordId,
        cashTendered: requestBody.cashTendered
      },
      cashierId
    );

    this.ok(res, paymentDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasCashierRole = await this._userRoleService.hasGivenRoles(tokenUserId, ["CASHIER"]);

    if (!hasCashierRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return tokenUserId;
  }
}
