import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import type { IUserLoginResponse } from "../../../dtos/userDTO";
import type { LoginRequest } from "../../../dtos/userRequestSchema";
import { LoginUserUseCase } from "../../../useCases/auth/loginUserUseCase";

export class LoginUserController extends BaseController {
  private _userLoginUseCase: LoginUserUseCase;

  public constructor(userLoginUseCase = new LoginUserUseCase()) {
    super();
    this._userLoginUseCase = userLoginUseCase;
  }

  protected async executeImpl(req: Request, res: Response) {
    const requestBody: LoginRequest = req.body;
    const accessToken = await this._userLoginUseCase.execute(requestBody);

    res.cookie("accessToken", accessToken.accessToken, {
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000,
      signed: true
    });

    this.ok<IUserLoginResponse>(res, accessToken);
  }
}
