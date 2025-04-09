import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../../shared/lib/jsonWebToken";
import { UserRepository } from "../../../../repositories/userRepository";
import { type IUserRoleService, UserRoleService } from "../../../../shared/service/userRoleService";
import { GetTotalUserCountUseCase } from "../../../../useCases/user/getTotalUserCountUseCase";

export class GetTotalUserCountController extends BaseController {
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: IUserRoleService;
  private _getTotalUserCountUseCase: GetTotalUserCountUseCase;

  public constructor(
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService(),
    userRepository = new UserRepository(),
    getTotalUserCountUseCase = new GetTotalUserCountUseCase(userRepository)
  ) {
    super();
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
    this._getTotalUserCountUseCase = getTotalUserCountUseCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const type = req.query.type as string;
    const result = await this._getTotalUserCountUseCase.execute(type);

    res.json({ count: result.count });
  }

  private async _verifyPermission(req: Request): Promise<void> {
    const accessToken = this._getAccessToken(req);
    const { id } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasPermission = await this._userRoleService.hasGivenRoles(id, ["SUPERADMIN", "ADMIN"]);
    if (!hasPermission) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }
  }
}
