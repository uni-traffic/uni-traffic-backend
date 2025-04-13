import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../../user/tests/utils/user/seedUser";
import { seedUserSignInActivity } from "../../../utils/seedUserSignInActivity";

describe("GET /api/v1/sign-in-activity/count", () => {
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

  it("should return status 200 and the correct count", async () => {
    await Promise.all([
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      })
    ]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });
    const payload = {
      startDate: "2025-04-01",
      endDate: "2025-04-30"
    };

    const response = await requestAPI
      .get("/api/v1/sign-in-activity/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.count).toBe(5);
  });

  it("should return status 200 and the correct count when user has multiple different sign ins", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });
    await Promise.all([
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-03-01T00:00:00.000Z",
          to: "2025-03-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        userId: seededUser.id,
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        userId: seededUser.id,
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        userId: seededUser.id,
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      }),
      seedUserSignInActivity({
        time: faker.date.between({
          from: "2025-04-01T00:00:00.000Z",
          to: "2025-04-30T23:59:59.999Z"
        })
      })
    ]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });
    const payload = {
      startDate: "2025-04-01",
      endDate: "2025-04-30"
    };

    const response = await requestAPI
      .get("/api/v1/sign-in-activity/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.count).toBe(3);
  });

  it("should return status 400 when the startDate date is after the endDate date", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });
    const payload = {
      startDate: "2025-05-01",
      endDate: "2025-04-30"
    };

    const response = await requestAPI
      .get("/api/v1/sign-in-activity/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 403 status code and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });

    const payload = {
      startDate: "2025-05-01",
      endDate: "2025-05-05"
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
});
