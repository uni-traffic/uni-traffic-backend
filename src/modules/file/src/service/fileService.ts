import type { FileUploadRequestSchema } from "../dtos/fileRequestSchema";
import { GetSignedUrlUseCase } from "../useCases/getSignedUrlUseCase";
import { UploadFileUseCase } from "../useCases/uploadFileUseCase";

export interface IFileService {
  getSignedUrl(path: string): Promise<{ signedUrl: string }>;
  uploadFile(params: FileUploadRequestSchema): Promise<{ path: string }>;
}

export class FileService implements IFileService {
  private _getSignedUrlUseCase: GetSignedUrlUseCase;
  private _uploadFileUseCase: UploadFileUseCase;

  public constructor(
    getSignedUrlUseCase: GetSignedUrlUseCase = new GetSignedUrlUseCase(),
    uploadFileUseCase: UploadFileUseCase = new UploadFileUseCase()
  ) {
    this._getSignedUrlUseCase = getSignedUrlUseCase;
    this._uploadFileUseCase = uploadFileUseCase;
  }

  public async getSignedUrl(path: string): Promise<{ signedUrl: string }> {
    return this._getSignedUrlUseCase.execute(path);
  }

  public async uploadFile(params: FileUploadRequestSchema): Promise<{ path: string }> {
    return this._uploadFileUseCase.execute(params);
  }
}
