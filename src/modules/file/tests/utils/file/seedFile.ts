import fs from "node:fs";
import path from "node:path";
import { FileService } from "../../../src/service/fileService";

export const seedFile = async () => {
  const filePath = path.join(__dirname, "../data/mock-photo.jpg");
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist at path: ${filePath}`);
  }

  const fileService = new FileService();
  const buffer = fs.readFileSync(filePath);

  return await fileService.uploadFile({
    buffer: buffer,
    mimeType: "image/jpg"
  });
};
