import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../utils/user/seedAuthenticatedUser";
import type { GetUserRequest } from "../../../../../src/dtos/userRequestSchema";
import { seedUser } from "../../../../utils/user/seedUser";
import { faker } from "@faker-js/faker";
import type { IUserDTO } from "../../../../../src/dtos/userDTO";

describe("GET /api/v1/user/search", () => {
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
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
      id: seededUser.id
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody[0].id).toBe(seededUser.id);
    expect(responseBody[0].firstName).toBe(seededUser.firstName);
    expect(responseBody[0].lastName).toBe(seededUser.lastName);
    expect(responseBody[0].username).toBe(seededUser.username);
    expect(responseBody[0].email).toBe(seededUser.email);
    expect(responseBody[0].role).toBe(seededUser.role);
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
      firstName: seededUser.firstName
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as IUserDTO[];
    const mappedUser = responseBody.map((users) => users.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(2);
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
      lastName: seededUser.lastName
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as IUserDTO[];
    const mappedUser = responseBody.map((users) => users.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(2);
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
      email: seededUser.email
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as IUserDTO[];

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(1);
    expect(responseBody[0].id).toBe(seededUser.id);
    expect(responseBody[0].id).not.toBe(seededUser1.id);
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
      role: "STUDENT"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as IUserDTO[];
    const mappedUser = responseBody.map((users) => users.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
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
      role: "STUDENT"
    };

    const response = await requestAPI
      .get("/api/v1/user/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody[0].id).toBe(seededUser1.id);
    expect(responseBody[0].id).not.toBe(seededUser2.id);
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
        id: faker.string.uuid()
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
        id: faker.string.uuid()
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
          id: faker.string.uuid()
        });
      const responseBody = response.body;

      expect(response.status).toBe(401);
      expect(responseBody.message).toBe("The provided token is invalid or malformed.");
    });
});
