import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { ViolationRecordPaymentRequest } from "../../../dtos/violationRecordPaymentRequestSchema";
import { AddViolationRecordPaymentUseCase } from "../../../useCases/addViolationRecordPaymentUseCase";
import { ViolationRecordRepository } from "../../../../../violationRecord/src/repositories/violationRecordRepository";
import { ViolationRecordPaymentRepository } from "../../../repositories/addViolationRecordPaymentRepository";
import { ViolationRecordAuditLogService } from "../../../../../violationRecordAuditLog/src/service/violationRecordAuditLogService";

export class AddViolationRecordPaymentController extends BaseController {
  private _addViolationRecordPaymentUseCase: AddViolationRecordPaymentUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    addViolationRecordPaymentUseCase = new AddViolationRecordPaymentUseCase(
      new ViolationRecordRepository(),
      new ViolationRecordPaymentRepository(),
      new ViolationRecordAuditLogService()
    ),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._addViolationRecordPaymentUseCase = addViolationRecordPaymentUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const cashierId = await this._verifyPermission(req);
      const requestBody = req.body as ViolationRecordPaymentRequest;

      const result = await this._addViolationRecordPaymentUseCase.execute(
        {
          violationRecordId: requestBody.violationRecordId,
          amountPaid: requestBody.amountPaid
        },
        cashierId
      );

      if (result.isSuccess) {
        this.ok(res, "Payment processed successfully.");
      } else {
        this.fail(res, new Error(result.getErrorMessage() || "Failed to process payment."));
      }
    } catch (error) {
      this.fail(res, error instanceof Error ? error : new Error("An unexpected error occurred."));
    }
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
