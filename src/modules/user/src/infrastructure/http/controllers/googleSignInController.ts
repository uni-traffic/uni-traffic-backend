import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import type { IUserLoginResponse } from "../../../dtos/userDTO";
import { GoogleSignInUseCase } from "../../../useCases/auth/googleSignInUseCase";

export class GoogleSignInController extends BaseController {
  private _googleSignInUseCase: GoogleSignInUseCase;

  public constructor(googleSignInUseCase: GoogleSignInUseCase = new GoogleSignInUseCase()) {
    super();
    this._googleSignInUseCase = googleSignInUseCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const requestBody = req.body;

    const response = await this._googleSignInUseCase.execute({
      token: requestBody.token,
      clientType: requestBody.clientType
    });

    res.cookie("accessToken", response.accessToken, {
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000,
      signed: true
    });

    this.ok<IUserLoginResponse>(res, response);
  }
}
