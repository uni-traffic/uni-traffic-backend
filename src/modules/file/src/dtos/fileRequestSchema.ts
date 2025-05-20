import z, { string } from "zod";

export interface FileUploadRequestSchema {
  buffer: Buffer;
  mimeType: string;
}

export const GetSignedUrlRequest = z.object({
  path: string()
});
export type GetSignedUrl = z.infer<typeof GetSignedUrlRequest>;
