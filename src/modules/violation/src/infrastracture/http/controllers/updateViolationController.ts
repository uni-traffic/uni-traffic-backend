import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { IViolationDTO } from "../../../dtos/violationDTO";
import { UpdateViolationRequestSchema } from "../../../dtos/violationRequestSchema";
import { UpdateViolationUseCase } from "../../../useCases/updateViolationUseCase";

export class UpdateViolationController extends BaseController {
  private _updateViolationUseCase: UpdateViolationUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    getViolationsUseCase = new UpdateViolationUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._updateViolationUseCase = getViolationsUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response) {
    await this._verifyPermission(req);

    const requestBody = UpdateViolationRequestSchema.parse(req.body);
    const violationsDTO = await this._updateViolationUseCase.execute(requestBody);

    this.ok<IViolationDTO>(res, violationsDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: userId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasGivenRoles = await this._userRoleService.hasGivenRoles(userId, [
      "ADMIN",
      "SECURITY",
      "SUPERADMIN"
    ]);
    if (!hasGivenRoles) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return userId;
  }
}
