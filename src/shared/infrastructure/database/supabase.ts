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
}

export class SupabaseStorageService implements IStorageService {
  private supabase;

  constructor(supabaseUrl = process.env.SUPABASE_URL, supabaseKey = process.env.SUPABASE_KEY) {
    if (!supabaseUrl) {
      throw new AppError("[UTE005] Key not defined");
    }
    if (!supabaseKey) {
      throw new AppError("[UTE006] Key not defined");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
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
    const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, 300);
    if (error || !data.signedUrl) {
      throw new UnexpectedError("[UTE009] Something went wrong getting signed url");
    }

    return data.signedUrl;
  }
}
