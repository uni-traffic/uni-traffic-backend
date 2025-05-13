import { v4 as uuid } from "uuid";
import { AppError } from "../../../../shared/core/errors";
import {
  type IStorageService,
  SupabaseStorageService
} from "../../../../shared/infrastructure/database/supabase";
import type { FileUploadRequestSchema } from "../dtos/fileRequestSchema";

export interface IFileService {
  getSignedUrl(path: string): Promise<{ signedUrl: string }>;
  uploadFile(params: FileUploadRequestSchema): Promise<{ path: string }>;
  moveFile(currentPath: string, newPath: string): Promise<{ path: string }>;
}

export class FileService implements IFileService {
  private _storageService: IStorageService;
  private readonly _bucketName: string;

  public constructor(
    storageService: IStorageService = new SupabaseStorageService(),
    bucketName = process.env.SUPABASE_BUCKET_NAME
  ) {
    this._storageService = storageService;

    if (!bucketName) throw new AppError("[UTE007] Key not defined");
    this._bucketName = bucketName;
  }

  public async getSignedUrl(path: string): Promise<{ signedUrl: string }> {
    const signedUrl = await this._storageService.getSignedUrl(this._bucketName, path);

    return { signedUrl: signedUrl };
  }

  public async uploadFile(params: FileUploadRequestSchema): Promise<{ path: string }> {
    const filePath = `temp/${uuid()}`;
    const path = await this._storageService.uploadFile(
      this._bucketName,
      filePath,
      params.buffer,
      params.mimeType
    );

    return { path };
  }

  public async moveFile(currentPath: string, newPath: string): Promise<{ path: string }> {
    const newFilePath = await this._storageService.moveFile(this._bucketName, {
      currentPath,
      newPath
    });

    return { path: newFilePath };
  }
}
