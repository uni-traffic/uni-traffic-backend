import type { Request, Response } from "express";
import { ForbiddenError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { UserRoleService } from "../../../../../user/src/shared/service/userRoleService";
import type { ViolationRecordRequest } from "../../../dtos/violationRecordRequestSchema";
import { CreateViolationRecordUseCase } from "../../../useCases/createViolationRecordUseCase";

export class CreateViolationRecordController extends BaseController {
  private _createViolationRecordUseCase: CreateViolationRecordUseCase;
  private _jsonWebToken: IJSONWebToken;
  private _userRoleService: UserRoleService;

  public constructor(
    createViolationRecordUseCase = new CreateViolationRecordUseCase(),
    jsonWebToken = new JSONWebToken(),
    userRoleService = new UserRoleService()
  ) {
    super();
    this._createViolationRecordUseCase = createViolationRecordUseCase;
    this._jsonWebToken = jsonWebToken;
    this._userRoleService = userRoleService;
  }

  protected async executeImpl(req: Request, res: Response) {
    const reportedById = await this._verifyPermission(req);
    const requestBody = req.body as ViolationRecordRequest;

    const violationRecordDTO = await this._createViolationRecordUseCase.execute({
      ...requestBody,
      reportedById
    });

    this.created(res, "Violation created.", violationRecordDTO);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const decodedToken = this._jsonWebToken.verify(accessToken) as { id: string };

    const hasSecurityRole = await this._userRoleService.hasSecurityRole(decodedToken.id);
    if (!hasSecurityRole) {
      throw new ForbiddenError("You do not have the required permissions to perform this action.");
    }

    return decodedToken.id;
  }
}
