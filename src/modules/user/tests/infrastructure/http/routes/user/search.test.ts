import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import type { GetUserResponse } from "../../../../../src/dtos/userDTO";
import type { GetUserRequest } from "../../../../../src/dtos/userRequestSchema";
import { seedAuthenticatedUser } from "../../../../utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../utils/user/seedUser";

describe("GET /api/v1/user/search", () => {
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

  it("should return status 200 and User when provided with id", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["SECURITY", "STUDENT", "STAFF"])
    });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload: GetUserRequest = {
      id: seededUser.id,
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.user[0].id).toBe(seededUser.id);
    expect(responseBody.user[0].firstName).toBe(seededUser.firstName);
    expect(responseBody.user[0].lastName).toBe(seededUser.lastName);
    expect(responseBody.user[0].username).toBe(seededUser.username);
    expect(responseBody.user[0].email).toBe(seededUser.email);
    expect(responseBody.user[0].role).toBe(seededUser.role);
  });

  it("should return status 200 and User when provided with firstName", async () => {
    const seededUser = await seedUser({ firstName: "Robs" });
    const seededUser1 = await seedUser({ firstName: "Robs" });
    const seededUser2 = await seedUser({ firstName: "Angelo" });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload: GetUserRequest = {
      firstName: seededUser.firstName,
      count: "2",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;
    const mappedUser = responseBody.user.map((users) => users.id);

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(2);
    expect(mappedUser).toContain(seededUser.id);
    expect(mappedUser).toContain(seededUser1.id);
    expect(mappedUser).not.toContain(seededUser2.id);
  });

  it("should return status 200 and User when provided with lastName", async () => {
    const seededUser = await seedUser({ lastName: "Herrera" });
    const seededUser1 = await seedUser({ lastName: "Herrera" });
    const seededUser2 = await seedUser({ lastName: "Montajes" });
    const seededUser3 = await seedUser({ lastName: "Yumul" });
    const seededUser4 = await seedUser({ lastName: "Ramos" });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload: GetUserRequest = {
      lastName: seededUser.lastName,
      count: "2",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;
    const mappedUser = responseBody.user.map((users) => users.id);

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(2);
    expect(mappedUser).toContain(seededUser.id);
    expect(mappedUser).toContain(seededUser1.id);
    expect(mappedUser).not.toContain(seededUser2.id);
    expect(mappedUser).not.toContain(seededUser3.id);
    expect(mappedUser).not.toContain(seededUser4.id);
  });

  it("should return status 200 and User when provided with email", async () => {
    const seededUser = await seedUser({});
    const seededUser1 = await seedUser({});

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload: GetUserRequest = {
      email: seededUser.email,
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(1);
    expect(responseBody.user[0].id).toBe(seededUser.id);
    expect(responseBody.user[0].id).not.toBe(seededUser1.id);
  });

  it("should return status 200 and User when provided with role", async () => {
    const seededUser1 = await seedUser({ role: "STUDENT" });
    const seededUser2 = await seedUser({ role: "STUDENT" });
    const seededUser3 = await seedUser({ role: "STUDENT" });
    const seededUser4 = await seedUser({ role: "STAFF" });
    const seededUser5 = await seedUser({ role: "STAFF" });
    const seededUser6 = await seedUser({ role: "SECURITY" });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload: GetUserRequest = {
      role: "STUDENT",
      count: "3",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;
    const mappedUser = responseBody.user.map((users) => users.id);

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(3);
    expect(mappedUser).toContain(seededUser1.id);
    expect(mappedUser).toContain(seededUser2.id);
    expect(mappedUser).toContain(seededUser3.id);
    expect(mappedUser).not.toContain(seededUser4.id);
    expect(mappedUser).not.toContain(seededUser5.id);
    expect(mappedUser).not.toContain(seededUser6.id);
  });

  it("should return status 200 and User when provided with given parameters", async () => {
    const seededUser1 = await seedUser({ role: "STUDENT" });
    const seededUser2 = await seedUser({ role: "STUDENT" });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload: GetUserRequest = {
      id: seededUser1.id,
      email: seededUser1.email,
      role: "STUDENT",
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user[0].id).toBe(seededUser1.id);
    expect(responseBody.user[0].id).not.toBe(seededUser2.id);
  });

  it("should status 200 and paginated users with correct metadata on first page", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const users = await Promise.all(Array.from({ length: 15 }).map(() => seedUser({})));

    const payload: GetUserRequest = {
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(10);
    expect(responseBody.hasNextPage).toBe(true);
    expect(responseBody.hasPreviousPage).toBe(false);
    expect(responseBody.totalPages).toBe(2);
  });

  it("should return status 200 and return second page with correct hasPreviousPage and hasNextPage flags", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const users = await Promise.all(Array.from({ length: 15 }).map(() => seedUser({})));

    const payload: GetUserRequest = {
      count: "10",
      page: "2"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(6);
    expect(responseBody.hasNextPage).toBe(false);
    expect(responseBody.hasPreviousPage).toBe(true);
    expect(responseBody.totalPages).toBe(2);
  });

  it("should return status 200 and return correct user when filtering by role and searchKey", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const seededUser = await seedUser({ role: "ADMIN", username: "Angelo Robee Herrera" });

    const payload: GetUserRequest = {
      count: "1",
      page: "1",
      role: "ADMIN",
      searchKey: "Angelo Robee"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBeGreaterThan(0);
    expect(responseBody.user[0].role).toBe("ADMIN");
    expect(responseBody.user[0].username).toContain("Angelo Robee");
  });

  it("should return status 200 and properly refine string count and page to numbers", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const seededUser = await seedUser({ role: "ADMIN", username: "Angelo Robee Herrera" });

    const payload: GetUserRequest = {
      id: seededUser.id,
      count: "1",
      page: "1",
      sort: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(1);
    expect(responseBody.hasPreviousPage).toBe(false);
    expect(responseBody.hasNextPage).toBe(false);
  });

  it("should return status 200 and default to sort order when sort is not provided", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const user = Promise.all([
      await seedUser({ username: "Robs" }),
      await seedUser({ username: "Herrera" })
    ]);

    const payload: GetUserRequest = {
      count: "3",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    const mappedUser = responseBody.user.map((users) => users.username);

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(3);
    expect(mappedUser).toContain("Herrera");
    expect(mappedUser).toContain("Robs");
  });

  it("should return status 200 and sort descending when sort order is 2", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const user = Promise.all([
      await seedUser({ username: "Robs" }),
      await seedUser({ username: "Herrera" })
    ]);

    const payload: GetUserRequest = {
      count: "3",
      page: "1",
      sort: "2"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    const mappedUser = responseBody.user.map((users) => users.username);

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBe(3);
    expect(mappedUser).toContain("Robs");
    expect(mappedUser).toContain("Herrera");
  });

  it("should return status 200 and filter user using partial user id match with searchKey", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const user = await seedUser({});

    const payload: GetUserRequest = {
      searchKey: user.id.slice(0, 8),
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBeGreaterThan(0);
    expect(responseBody.user[0].id).toContain(user.id.slice(0, 8));
  });

  it("should return status 200 and filter user using partial lastName match with searchKey", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const user = await seedUser({});

    const payload: GetUserRequest = {
      searchKey: user.lastName.slice(0, 8),
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBeGreaterThan(0);
    expect(responseBody.user[0].lastName).toContain(user.lastName.slice(0, 8));
  });

  it("should return status 200 and filter user using partial firstName match with searchKey", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const user = await seedUser({});

    const payload: GetUserRequest = {
      searchKey: user.firstName.slice(0, 8),
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBeGreaterThan(0);
    expect(responseBody.user[0].firstName).toContain(user.firstName.slice(0, 8));
  });

  it("should return status 200 and filter user using partial userName match with searchKey", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const user = await seedUser({});

    const payload: GetUserRequest = {
      searchKey: user.username.slice(0, 8),
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBeGreaterThan(0);
    expect(responseBody.user[0].username).toContain(user.username.slice(0, 8));
  });

  it("should return status 200 and filter user using partial email match with searchKey", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const user = await seedUser({});

    const payload: GetUserRequest = {
      searchKey: user.email.slice(0, 8),
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user.length).toBeGreaterThan(0);
    expect(responseBody.user[0].email).toContain(user.email.slice(0, 8));
  });

  it("should return status 200 and filter user using strict matching for id, lastName, firstName, userName, email", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const user = await seedUser({});

    const payload: GetUserRequest = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetUserResponse;

    expect(response.status).toBe(200);
    expect(responseBody.user[0].id).toBe(user.id);
    expect(responseBody.user[0].firstName).toBe(user.firstName);
    expect(responseBody.user[0].lastName).toBe(user.lastName);
    expect(responseBody.user[0].username).toBe(user.username);
    expect(responseBody.user[0].email).toBe(user.email);
  });

  it("should return status 400 when no parameters passed", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({});

    expect(response.status).toBe(400);
  });

  it("should return status 403 and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "SECURITY"])
    });

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: faker.string.uuid(),
        count: "1",
        page: "1"
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
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: faker.string.uuid(),
        count: "1",
        page: "1"
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return status 401 when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query({
        id: faker.string.uuid(),
        count: "1",
        page: "1"
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
