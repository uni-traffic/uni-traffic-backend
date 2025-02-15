import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError, UnauthorizedError } from "../core/errors";

export interface IJSONWebToken {
  sign(payload: object): string;
  verify<T>(token: string, expiration?: string): T;
}

export class JSONWebToken implements IJSONWebToken {
  private readonly _JWT_SECRET: string;
  private readonly _TOKEN_EXPIRATION: string;

  public constructor(
    secret = process.env.JWT_SECRET,
    tokenExpiration = process.env.JWT_EXPIRATION
  ) {
    if (!secret) {
      throw new AppError("[UTE001]");
    }

    if (!tokenExpiration) {
      throw new AppError("[UTE002]");
    }

    this._JWT_SECRET = secret;
    this._TOKEN_EXPIRATION = tokenExpiration;
  }

  public sign(payload: object, expiration?: string): string {
    // @ts-ignore
    return jwt.sign(payload, this._JWT_SECRET, {
      expiresIn: expiration ? expiration : this._TOKEN_EXPIRATION
    });
  }

  public verify<T>(token: string): T {
    try {
      return jwt.verify(token, this._JWT_SECRET) as T;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedError("Your session has expired. Please log in again.");
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError("The provided token is invalid or malformed.");
      }

      throw new AppError("[UTE002] Unexpected error during token verification.");
    }
  }
}
