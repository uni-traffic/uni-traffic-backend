import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../utils/user/seedUser";

describe("GET /api/v1/user/count", () => {
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return status 200 and correct user count for 'ALL' type", async () => {
    await Promise.all([
      seedUser({ role: "STUDENT" }),
      seedUser({ role: "STAFF" }),
      seedUser({ role: "SECURITY" })
    ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = { type: "ALL" };

    const response = await requestAPI
      .get("/api/v1/user/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.count).toBe(4);
  });

  it("should return status 200 and correct user count for 'MANAGEMENT' type", async () => {
    await Promise.all([
      seedUser({ role: "STUDENT" }),
      seedUser({ role: "STAFF" }),
      seedUser({ role: "SECURITY" }),
      seedUser({ role: "SUPERADMIN" })
    ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = { type: "MANAGEMENT" };

    const response = await requestAPI
      .get("/api/v1/user/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.count).toBe(3);
  });

  it("should return status 200 and correct user count for 'APP_USERS' type", async () => {
    await seedUser({ role: "STUDENT" });
    await seedUser({ role: "STAFF" });
    await seedUser({ role: "GUEST" });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = { type: "APP_USERS" };

    const response = await requestAPI
      .get("/api/v1/user/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.count).toBe(3);
  });

  it("should return status 200 and count of all users", async () => {
    await Promise.all([
      seedUser({ role: "STUDENT" }),
      seedUser({ role: "STAFF" }),
      seedUser({ role: "SECURITY" }),
      seedUser({ role: "CASHIER" }),
      seedUser({ role: "SUPERADMIN" })
    ]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const response = await requestAPI
      .get("/api/v1/user/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({});

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(6);
  });

  it("should return status 403 and message when Authorization lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "GUEST"])
    });

    const response = await requestAPI
      .get("/api/v1/user/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        type: "ALL"
      });
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return status 401 when the provided Authorization is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: "ADMIN"
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .get("/api/v1/user/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        type: "ALL"
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return status 401 when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .get("/api/v1/user/count")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query({
        type: "ALL"
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
