import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import {
  type IUserRoleService,
  UserRoleService
} from "../../../../../user/src/shared/service/userRoleService";
import { AddVehicleApplicationPaymentUseCase } from "../../../useCases/addVehicleApplicationPaymentUseCase";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import type { VehicleApplicationPaymentRequest } from "../../../dtos/vehicleApplicationPaymentRequestSchema";

export class AddVehicleApplicationPaymentController extends BaseController {
  private _addVehicleApplicationPaymentUseCase: AddVehicleApplicationPaymentUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: IUserRoleService;

  public constructor(
    addVehicleApplicationPaymentUseCase: AddVehicleApplicationPaymentUseCase = new AddVehicleApplicationPaymentUseCase(),
    jsonWebToken: IJSONWebToken = new JSONWebToken(),
    userRoleService: IUserRoleService = new UserRoleService()
  ) {
    super();
    this._addVehicleApplicationPaymentUseCase = addVehicleApplicationPaymentUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const cashierId = await this._verifyPermission(req);
    const requestBody = req.body as VehicleApplicationPaymentRequest;

    const paymentDTO = await this._addVehicleApplicationPaymentUseCase.execute(
      {
        vehicleApplicationId: requestBody.vehicleApplicationId,
        amountDue: requestBody.amountDue,
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
