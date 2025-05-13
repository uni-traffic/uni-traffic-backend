import type { Request, Response } from "express";
import { UnauthorizedError } from "../../../../../../shared/core/errors";
import { BaseController } from "../../../../../../shared/infrastructure/http/core/baseController";
import { DeleteTempFolderUseCase } from "../../../useCases/deleteTempFolderUseCase";

export class DeleteTempFolderController extends BaseController {
  private _useCase: DeleteTempFolderUseCase;

  public constructor(useCase: DeleteTempFolderUseCase = new DeleteTempFolderUseCase()) {
    super();
    this._useCase = useCase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    const authorization = await this._getKeyFromRequest(req);

    const result = await this._useCase.execute(authorization);

    this.ok<{ message: string }>(res, result);
  }

  private async _getKeyFromRequest(req: Request): Promise<string> {
    const accessToken = this._getAccessToken(req);
    if (!accessToken) {
      throw new UnauthorizedError("Authentication token is required");
    }

    return accessToken;
  }
}
