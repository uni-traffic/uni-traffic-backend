import { AppError, UnexpectedError } from "../../../../shared/core/errors";
import {
  type IStorageService,
  SupabaseStorageService
} from "../../../../shared/infrastructure/database/supabase";

export class DeleteTempFolderUseCase {
  private _storageService: IStorageService;
  private SYSTEM_KEY: string;
  private readonly BUCKET_NAME: string;

  public constructor(
    storageService: IStorageService = new SupabaseStorageService(),
    systemKey: string | undefined = process.env.SYSTEM_KEY,
    bucketName: string | undefined = process.env.SUPABASE_BUCKET_NAME
  ) {
    if (!systemKey) {
      throw new UnexpectedError("System key not defined");
    }
    if (!bucketName) throw new AppError("[UTE007] Key not defined");

    this._storageService = storageService;
    this.BUCKET_NAME = bucketName;
    this.SYSTEM_KEY = systemKey;
  }

  public async execute(key: string): Promise<{ message: string }> {
    this._ensureSystemKeyMatched(key);

    return await this._deleteFolder("temp");
  }

  private async _deleteFolder(folderName: string): Promise<{ message: string }> {
    const message = await this._storageService.deleteFolder(this.BUCKET_NAME, folderName);

    return { message: message };
  }

  private _ensureSystemKeyMatched(key: string) {
    const isMatch = key === this.SYSTEM_KEY;
    if (!isMatch) {
      throw new AppError("[UTE010] Key not defined");
    }
  }
}
