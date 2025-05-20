import type { Request, Response } from "express";
import { UnauthorizedError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import type { GetSignedUrl } from "../../../dtos/fileRequestSchema";
import { FileService, type IFileService } from "../../../service/fileService";

export class GetSignedUrlController extends BaseController {
  private _jsonWebToken: JSONWebToken;
  private _useCase: IFileService;

  public constructor(jsonWebToken = new JSONWebToken(), useCase: IFileService = new FileService()) {
    super();
    this._jsonWebToken = jsonWebToken;
    this._useCase = useCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const { path } = req.query as GetSignedUrl;
    const { signedUrl } = await this._useCase.getSignedUrl(path);

    this.ok(res, signedUrl);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);
    if (!tokenUserId) {
      throw new UnauthorizedError("You need to be authenticated to perform this action");
    }

    return tokenUserId;
  }
}
