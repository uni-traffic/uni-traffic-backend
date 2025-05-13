import type { Request, Response } from "express";
import { BadRequest, UnauthorizedError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { JSONWebToken } from "../../../../../../shared/lib/jsonWebToken";
import { FileService, type IFileService } from "../../../service/fileService";

export class UploadFileController extends BaseController {
  private _jsonWebToken: JSONWebToken;
  private _useCase: IFileService;

  public constructor(jsonWebToken = new JSONWebToken(), useCase: IFileService = new FileService()) {
    super();
    this._jsonWebToken = jsonWebToken;
    this._useCase = useCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    await this._verifyPermission(req);

    const file = this._getFileFromRequest(req);
    const result = await this._useCase.uploadFile({
      buffer: file.buffer,
      mimeType: file.mimetype
    });

    this.ok(res, result);
  }

  private async _verifyPermission(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    const { id: tokenUserId } = this._jsonWebToken.verify<{ id: string }>(accessToken);
    if (!tokenUserId) {
      throw new UnauthorizedError("You need to be authenticated to perform this action");
    }

    return tokenUserId;
  }

  private _getFileFromRequest(req: Request): Express.Multer.File {
    if (!req.file) {
      throw new BadRequest("No file uploaded");
    }

    const mimetype = req.file.mimetype;
    if (!mimetype || !mimetype.startsWith("image/")) {
      throw new BadRequest("Uploaded file is not an image.");
    }

    return req.file;
  }
}
