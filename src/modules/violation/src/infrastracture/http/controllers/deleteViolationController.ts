import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { IViolationDTO } from "../../../dtos/violationDTO";
import { DeleteViolationUseCase } from "../../../useCases/deleteViolationUseCase";

export class DeleteViolationController extends BaseController {
  private _deleteViolationUseCase: DeleteViolationUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    deleteViolationUseCase: DeleteViolationUseCase = new DeleteViolationUseCase(),
    jsonWebToken: IJSONWebToken = new JSONWebToken(),
    userRoleService: UserRoleService = new UserRoleService()
  ) {
    super();
    this._deleteViolationUseCase = deleteViolationUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const violationId = req.body.id;
    const violationDTO = await this._deleteViolationUseCase.execute(violationId);

    this.ok<IViolationDTO>(res, violationDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: userId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasGivenRoles = await this._userRoleService.hasGivenRoles(userId, [
      "ADMIN",
      "SUPERADMIN"
    ]);
    if (!hasGivenRoles) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return userId;
  }
}
