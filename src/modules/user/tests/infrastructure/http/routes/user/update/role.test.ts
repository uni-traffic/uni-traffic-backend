import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../../api";
import { db } from "../../../../../../../../shared/infrastructure/database/prisma";
import {
  type IUserRepository,
  UserRepository
} from "../../../../../../src/repositories/userRepository";
import { seedAuthenticatedUser } from "../../../../../utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../../utils/user/seedUser";

describe("POST /api/v1/user/update/role", () => {
  let userRepository: IUserRepository;
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully update the user role", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });
    const seededUser = await seedUser({ role: "STUDENT" });

    const payload = {
      userId: seededUser.id,
      role: "SECURITY"
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.role).toBe("SECURITY");

    const userFromDatabase = await userRepository.getUserById(seededUser.id);

    expect(userFromDatabase).not.toBeNull();
    expect(userFromDatabase!.role.value).toBe("SECURITY");
  });

  it("should successfully update the user to ADMIN if user that request has SUPERADMIN role", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SUPERADMIN",
      expiration: "1h"
    });
    const seededUser = await seedUser({ role: "STUDENT" });

    const payload = {
      userId: seededUser.id,
      role: "ADMIN"
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.role).toBe("ADMIN");

    const userFromDatabase = await userRepository.getUserById(seededUser.id);

    expect(userFromDatabase).not.toBeNull();
    expect(userFromDatabase!.role.value).toBe("ADMIN");
  });

  it("should return status 404 when user id provided does not exist on the system", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = {
      userId: faker.string.uuid(),
      role: "SECURITY"
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(404);
    expect(responseBody.message).toBe("User not found!");
  });

  it("should return status 400 when userId is not provided", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = {
      role: "HELLO"
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 400 when role is not provided", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = {
      userId: faker.string.uuid()
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 400 when role provided is invalid", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = {
      userId: faker.string.uuid(),
      role: "HELLO"
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 403 and message when user try to update user role to admin but lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "SECURITY", "ADMIN"])
    });

    const payload = {
      userId: faker.string.uuid(),
      role: "ADMIN"
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return status 403 and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "SECURITY"])
    });

    const payload = {
      userId: faker.string.uuid(),
      role: "ADMIN"
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
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

    const payload = {
      userId: faker.string.uuid(),
      role: "ADMIN"
    };
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return status 401 when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .post("/api/v1/user/update/role")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send({
        userId: faker.string.uuid(),
        role: "ADMIN"
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
