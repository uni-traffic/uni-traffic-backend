import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { FileService } from "../../../../../file/src/service/fileService";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../../user/tests/utils/user/seedUser";
import { seedVehicle } from "../../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../../../violation/tests/utils/violation/seedViolation";
import type { ViolationRecordCreateRequest } from "../../../../src/dtos/violationRecordRequestSchema";

describe("POST /api/v1/violation-record/create", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request.agent(app);

    jest.spyOn(FileService.prototype, "moveFile").mockResolvedValue({
      path: "/mocked/path/file.jpg"
    });
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
    await db.user.deleteMany();
    await db.violation.deleteMany();
    await seedViolation({ id: "1" });
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should create a violation record when only vehicleId is provided with valid requester role", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });
    const seededVehicle = await seedVehicle({ ownerId: seededUser.id });
    const reporter = await seedAuthenticatedUser({ role: "SECURITY", expiration: "1h" });

    const payload: ViolationRecordCreateRequest = {
      violationId: "1",
      evidence: [faker.image.url()],
      vehicleId: seededVehicle.id
    };
    const response = await requestAPI
      .post("/api/v1/violation-record/create")
      .set("Authorization", `Bearer ${reporter.accessToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("violationId");
    expect(response.body).toHaveProperty("vehicleId");
    expect(response.body).toHaveProperty("status");
  });

  it("should create a violation record when only licensePlate is provided with valid requester role", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });
    const seededVehicle = await seedVehicle({ ownerId: seededUser.id });
    const reporter = await seedAuthenticatedUser({ role: "SECURITY", expiration: "1h" });

    const payload: ViolationRecordCreateRequest = {
      violationId: "1",
      evidence: [faker.image.url()],
      licensePlate: seededVehicle.licensePlate
    };
    const response = await requestAPI
      .post("/api/v1/violation-record/create")
      .set("Authorization", `Bearer ${reporter.accessToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("violationId");
    expect(response.body).toHaveProperty("vehicleId");
    expect(response.body).toHaveProperty("status");
  });

  it("should create a violation record when only stickerNumber is provided with valid requester role", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });
    const seededVehicle = await seedVehicle({ ownerId: seededUser.id });
    const reporter = await seedAuthenticatedUser({ role: "SECURITY", expiration: "1h" });

    const payload: ViolationRecordCreateRequest = {
      violationId: "1",
      evidence: [faker.image.url()],
      stickerNumber: seededVehicle.stickerNumber
    };
    const response = await requestAPI
      .post("/api/v1/violation-record/create")
      .set("Authorization", `Bearer ${reporter.accessToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("violationId");
    expect(response.body).toHaveProperty("vehicleId");
    expect(response.body).toHaveProperty("status");
  });

  it("should return status code 403 if user lacks permission", async () => {
    const reporter = await seedAuthenticatedUser({ role: "STAFF", expiration: "1h" });

    const payload: ViolationRecordCreateRequest = {
      violationId: "1",
      evidence: [faker.image.url()],
      stickerNumber: faker.vehicle.vin()
    };
    const response = await requestAPI
      .post("/api/v1/violation-record/create")
      .set("Authorization", `Bearer ${reporter.accessToken}`)
      .send(payload);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return 400 if request is invalid", async () => {
    const payload = {
      userId: "ownerId",
      vehicleId: "vehicleId",
      violationId: "violationId",
      evidence: [faker.image.url()]
    };
    const response = await requestAPI.post("/api/v1/violation-record/create").send(payload);

    expect(response.status).toBe(401);
  });
});
