import { AppError } from "../../../../shared/core/errors";
import {
  type IStorageService,
  SupabaseStorageService
} from "../../../../shared/infrastructure/database/supabase";

export class GetSignedUrlUseCase {
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

  public async execute(path: string): Promise<{ signedUrl: string }> {
    const signedUrl = await this._storageService.getSignedUrl(this._bucketName, path);

    return { signedUrl: signedUrl };
  }
}
