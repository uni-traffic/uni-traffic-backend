import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { AppError } from "../../../../shared/core/errors";
import {
  type IStorageService,
  SupabaseStorageService
} from "../../../../shared/infrastructure/database/supabase";
import type { FileUploadRequestSchema } from "../dtos/fileRequestSchema";

dotenv.config();
// [UTE007]

export class UploadFileUseCase {
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

  public async execute(params: FileUploadRequestSchema): Promise<{ path: string }> {
    const filePath = `uploads/${uuid()}`;
    const path = await this._storageService.uploadFile(
      this._bucketName,
      filePath,
      params.buffer,
      params.mimeType
    );

    return { path };
  }
}
