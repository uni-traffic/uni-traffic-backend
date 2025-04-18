import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../../../user/tests/utils/user/seedUser";
import type { GetTotalUniqueSignInByGivenRange } from "../../../../../src/dtos/userSignInActivityRequestSchema";
import { seedUserSignInActivity } from "../../../../utils/seedUserSignInActivity";

describe("GET /api/v1/sign-in-activity/stats/count", () => {
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

  it("should return status 200 and return the correct count of user sign in activity by DAY on given range", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const seededUser = await seedUser({});
    await Promise.all([
      seedUserSignInActivity({ time: new Date("2024-05-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-05-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-05-01") }),
      seedUserSignInActivity({ time: new Date("2024-05-02") }),
      seedUserSignInActivity({ time: new Date("2024-05-02") }),
      seedUserSignInActivity({ time: new Date("2024-05-03") }),
      seedUserSignInActivity({ time: new Date("2024-05-03") })
    ]);

    const payload: GetTotalUniqueSignInByGivenRange = {
      startDate: "2024-05-01T00:00:00.000Z",
      endDate: "2024-05-05T23:59:59.999Z",
      type: "DAY"
    };
    const response = await requestAPI
      .get("/api/v1/sign-in-activity/stats/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toContainEqual({ date: "2024-05-01", count: 2 });
    expect(responseBody).toContainEqual({ date: "2024-05-02", count: 2 });
    expect(responseBody).toContainEqual({ date: "2024-05-03", count: 2 });
  });

  it("should return status 200 and return the correct count of user sign in activity by MONTH on given range", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const seededUser = await seedUser({});
    await Promise.all([
      seedUserSignInActivity({ time: new Date("2024-05"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-05"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-05") }),
      seedUserSignInActivity({ time: new Date("2024-06") }),
      seedUserSignInActivity({ time: new Date("2024-06-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-06-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-06-02"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-06-02"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024-06") }),
      seedUserSignInActivity({ time: new Date("2024-08") }),
      seedUserSignInActivity({ time: new Date("2024-08") })
    ]);

    const payload: GetTotalUniqueSignInByGivenRange = {
      startDate: "2024-01-01T00:00:00.000Z",
      endDate: "2024-12-31T23:59:59.999Z",
      type: "MONTH"
    };
    const response = await requestAPI
      .get("/api/v1/sign-in-activity/stats/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toContainEqual({ date: "2024-05", count: 2 });
    expect(responseBody).toContainEqual({ date: "2024-06", count: 4 });
    expect(responseBody).toContainEqual({ date: "2024-08", count: 2 });
  });

  it("should return status 200 and return the correct count of user sign in activity by YEAR on given range", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const seededUser = await seedUser({});
    await Promise.all([
      seedUserSignInActivity({ time: new Date("2024"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2024") }),
      seedUserSignInActivity({ time: new Date("2025-06") }),
      seedUserSignInActivity({ time: new Date("2025-06-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2025-06-01"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2025-06-02"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2025-06-02"), userId: seededUser.id }),
      seedUserSignInActivity({ time: new Date("2021-06") }),
      seedUserSignInActivity({ time: new Date("2021-08") }),
      seedUserSignInActivity({ time: new Date("2021-08") })
    ]);

    const payload: GetTotalUniqueSignInByGivenRange = {
      startDate: "2020-01-01T00:00:00.000Z",
      endDate: "2025-12-31T23:59:59.999Z",
      type: "YEAR"
    };
    const response = await requestAPI
      .get("/api/v1/sign-in-activity/stats/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toContainEqual({ date: "2024", count: 2 });
    expect(responseBody).toContainEqual({ date: "2025", count: 3 });
    expect(responseBody).toContainEqual({ date: "2021", count: 3 });
  });

  it("should return status 403 when user lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });

    const payload: GetTotalUniqueSignInByGivenRange = {
      startDate: "2024-05-01T00:00:00.000Z",
      endDate: "2024-05-05T23:59:59.999Z",
      type: "DAY"
    };
    const response = await requestAPI
      .get("/api/v1/sign-in-activity/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have required permission to perform this action."
    );
  });

  it("should return status 400 when query lacks parameter", async () => {
    const payload = {
      startDate: "2020-01-01T00:00:00.000Z"
    };
    const response = await requestAPI
      .get("/api/v1/sign-in-activity/stats/count")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query(payload);

    expect(response.status).toBe(400);
  });
});
