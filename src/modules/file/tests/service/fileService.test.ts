import fs from "node:fs";
import path from "node:path";
import { FileService, type IFileService } from "../../src/service/fileService";

describe("FileService", () => {
  let service: IFileService;

  beforeAll(() => {
    service = new FileService();
  });

  it("should successfully upload the file", async () => {
    const filePath = path.join(__dirname, "../utils/data/mock-photo.jpg");
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    const buffer = fs.readFileSync(filePath);
    const result = await service.uploadFile({
      buffer: buffer,
      mimeType: "image/jpg"
    });

    expect(result.path).toBeDefined();
  });

  it("should successfully get a signed url of the requested file", async () => {
    const filePath = path.join(__dirname, "../utils/data/mock-photo.jpg");
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    const buffer = fs.readFileSync(filePath);
    const uploadResult = await service.uploadFile({
      buffer: buffer,
      mimeType: "image/jpg"
    });

    expect(uploadResult.path).toBeDefined();

    const getResult = await service.getSignedUrl(uploadResult.path);

    expect(getResult.signedUrl).toBeDefined();
  });
});
