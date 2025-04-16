import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { IViolationDTO } from "../../../dtos/violationDTO";
import type { ViolationCreateRequest } from "../../../dtos/violationRequestSchema";
import { CreateViolationUseCase } from "../../../useCases/createViolationUseCase";

export class CreateViolationController extends BaseController {
  private _createViolationUseCase: CreateViolationUseCase;
  private _jsonWebToken: JSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    createViolationUseCase: CreateViolationUseCase = new CreateViolationUseCase(),
    jsonWebToken: JSONWebToken = new JSONWebToken(),
    userRoleService: UserRoleService = new UserRoleService()
  ) {
    super();
    this._createViolationUseCase = createViolationUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const requestBody = req.body as ViolationCreateRequest;
    const violationDTO = await this._createViolationUseCase.execute(requestBody);

    this.created<IViolationDTO>(res, "Violation created successfully", violationDTO);
  }

  private async _verifyPermission(req: Request): Promise<void> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    const hasRequiredRole = await this._userRoleService.hasGivenRoles(tokenUserId, ["SECURITY"]);

    if (!hasRequiredRole) {
      throw new ForbiddenError("You do not have required permission to perform this action.");
    }
  }
}
