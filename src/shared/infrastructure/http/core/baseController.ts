import type { Request, Response } from "express";
import {
  BadRequest,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError
} from "../../../core/errors";

export abstract class BaseController {
  protected abstract executeImpl(req: Request, res: Response): Promise<void>;

  public async execute(req: Request, res: Response): Promise<void> {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      this.fail(res, err as Error);
    }
  }

  protected ok<T>(res: Response, dto?: T) {
    if (dto) {
      return res.status(200).json(dto);
    }

    return res.sendStatus(200);
  }

  protected created<T>(res: Response, message: string, dto?: T) {
    if (dto) {
      return res.status(201).json({
        ...dto,
        message: message
      });
    }

    return res.sendStatus(201).json(message);
  }

  protected fail(res: Response, error: Error) {
    if (error instanceof BadRequest) {
      return this.jsonResponse(res, 400, error.message);
    }

    if (error instanceof UnauthorizedError) {
      res.clearCookie("accessToken", {
        httpOnly: true,
        signed: true
      });

      return this.jsonResponse(res, 401, error.message);
    }

    if (error instanceof ForbiddenError) {
      return this.jsonResponse(res, 403, error.message);
    }

    if (error instanceof NotFoundError) {
      return this.jsonResponse(res, 404, error.message);
    }

    if (error instanceof ConflictError) {
      return this.jsonResponse(res, 409, error.message);
    }

    this.jsonResponse(res, 500, error.message);
  }

  protected jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  protected _getAccessToken(req: Request) {
    const accessTokenFromCookie = req.signedCookies.accessToken;
    const accessTokenFromHeaders = req.headers["authorization"];
    if (
      !accessTokenFromCookie &&
      (!accessTokenFromHeaders || !accessTokenFromHeaders.startsWith("Bearer "))
    ) {
      throw new UnauthorizedError('Access token is required "Bearer {token}"');
    }

    return accessTokenFromCookie
      ? accessTokenFromCookie
      : accessTokenFromHeaders!.replace("Bearer ", "");
  }
}
