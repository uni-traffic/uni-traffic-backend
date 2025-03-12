import type { Request, Response } from "express";
import { BaseController } from "../../../../../../../shared/infrastructure/http/core/baseController";
import { type IJSONWebToken, JSONWebToken } from "../../../../../../../shared/lib/jsonWebToken";
import type { IUserDTO } from "../../../../dtos/userDTO";
import { GetUserByIdUseCase } from "../../../../useCases/user/getUserByIdUseCase";

export class MyProfileController extends BaseController {
  private _jsonWebToken: IJSONWebToken;
  private _getUserByIdUseCase: GetUserByIdUseCase;

  public constructor(
    jsonWebToken = new JSONWebToken(),
    getUserByIdUseCase = new GetUserByIdUseCase()
  ) {
    super();
    this._jsonWebToken = jsonWebToken;
    this._getUserByIdUseCase = getUserByIdUseCase;
  }

  protected async executeImpl(req: Request, res: Response) {
    const senderId = await this._verifyPermission(req);

    const user = await this._getUserByIdUseCase.execute(senderId);

    this.ok<IUserDTO>(res, user);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id } = this._jsonWebToken.verify<{ id: string }>(accessToken);

    return id;
  }
}
