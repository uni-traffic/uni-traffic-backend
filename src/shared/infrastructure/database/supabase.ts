import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { AppError, UnexpectedError } from "../../core/errors";

// [UTE005]
// [UTE006]
// [UTE008]
// [UTE009]
dotenv.config();

export interface IStorageService {
  uploadFile(bucket: string, path: string, fileBuffer: Buffer, mimeType: string): Promise<string>;
  getSignedUrl(bucket: string, path: string): Promise<string>;
  getSignedUrls(bucket: string, paths: string[]): Promise<string[]>;
  moveFile(
    bucketName: string,
    { currentPath, newPath }: { currentPath: string; newPath: string }
  ): Promise<string>;
  deleteFolder(bucket: string, folder: string): Promise<string>;
}

export class SupabaseStorageService implements IStorageService {
  private supabase;
  private readonly _image_placeholder: string;

  constructor(
    supabaseUrl = process.env.SUPABASE_URL,
    supabaseKey = process.env.SUPABASE_KEY,
    image_placeholder = process.env.SUPABASE_IMAGE_PLACEHOLDER
  ) {
    if (!supabaseUrl) {
      throw new AppError("[UTE005] Key not defined");
    }
    if (!supabaseKey) {
      throw new AppError("[UTE006] Key not defined");
    }
    if (!image_placeholder) {
      throw new AppError("[UTE009] Image Placeholder not defined");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this._image_placeholder = image_placeholder;
  }

  public async uploadFile(bucket: string, path: string, fileBuffer: Buffer, mimeType: string) {
    const { data, error } = await this.supabase.storage.from(bucket).upload(path, fileBuffer, {
      contentType: mimeType,
      upsert: false
    });
    if (error) {
      throw new UnexpectedError("[UTE008] Something went wrong uploading the file");
    }

    return data.path;
  }

  public async getSignedUrl(bucket: string, path: string): Promise<string> {
    const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, 3600);
    if (error || !data.signedUrl) {
      return this._image_placeholder;
    }

    return data.signedUrl;
  }

  public async getSignedUrls(bucket: string, paths: string[]): Promise<string[]> {
    const { data, error } = await this.supabase.storage.from(bucket).createSignedUrls(paths, 3600);

    if (error || !data) {
      return paths.map(() => this._image_placeholder);
    }

    return data.map((item) => item.signedUrl || this._image_placeholder);
  }

  public async moveFile(
    bucketName: string,
    { currentPath, newPath }: { currentPath: string; newPath: string }
  ): Promise<string> {
    const { error } = await this.supabase.storage.from(bucketName).move(currentPath, newPath);
    if (error) {
      throw new UnexpectedError("Error occurred in managing uploaded fies");
    }

    return newPath;
  }

  public async deleteFolder(bucket: string, folder: string): Promise<string> {
    const { data: list } = await this.supabase.storage.from(bucket).list(`${folder}/`);
    const filesToRemove = list ? list.map((x) => `${folder}/${x.name}`) : [];

    this.supabase.storage.from(bucket).remove(filesToRemove);

    await new Promise((resolve) => setTimeout(resolve, 500));

    return `Cleanup Performed: ${new Date().toISOString()}`;
  }
}
