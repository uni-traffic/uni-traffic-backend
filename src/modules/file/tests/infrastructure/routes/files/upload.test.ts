import * as fs from "node:fs";
import path from "node:path";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";

describe("POST api/v1/files/upload", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request(app);
  });

  it("should return 200 status code when successfully upload the file", async () => {
    const filePath = path.join(__dirname, "../../../utils/data/mock-photo.jpg");
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    const seededAuthenticatedUser = await seedAuthenticatedUser({ role: "ADMIN" });

    const response = await requestAPI
      .post("/api/v1/files/upload")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .attach("image", filePath);

    expect(response.statusCode).toBe(200);
    expect(response.body.path).toBeDefined();
  });

  it("should return 400 status code when the uploaded file is not an image", async () => {
    const filePath = path.join(__dirname, "../../../utils/data/mock-pdf.pdf");
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    const seededAuthenticatedUser = await seedAuthenticatedUser({ role: "ADMIN" });

    const response = await requestAPI
      .post("/api/v1/files/upload")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .attach("image", filePath);

    expect(response.statusCode).toBe(400);
    expect(response.body.path).not.toBeDefined();
  });

  it("should return 400 status code when file does not exist", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({ role: "ADMIN" });

    const response = await requestAPI
      .post("/api/v1/files/upload")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.path).not.toBeDefined();
  });

  it("should return 401 status code when authorization token is not provided", async () => {
    const response = await requestAPI.post("/api/v1/files/upload");

    expect(response.statusCode).toBe(401);
    expect(response.body.path).not.toBeDefined();
  });
});
