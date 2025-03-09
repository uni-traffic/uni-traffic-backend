import type { Request, Response } from "express";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";

export class LogOutUserController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    res.clearCookie("accessToken", {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none"
    });

    this.ok(res, { message: "Logged out!" });
  }
}
