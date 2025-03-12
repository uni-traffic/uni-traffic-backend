import type { Request, Response } from "express";
import { BaseController } from "../../../../../../../shared/infrastructure/http/core/baseController";

export class LogOutUserController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const cookieOptions = this._getCookieOptions();
    res.clearCookie("accessToken", {
      ...cookieOptions,
      maxAge: undefined
    });

    this.ok(res, { message: "Logged out!" });
  }
}
