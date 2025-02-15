import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import type { LoginRequest } from "../../../../../src/dtos/userRequestSchema";
import { seedUser } from "../../../../utils/user/seedUser";

describe("POST /api/v1/auth/login", () => {
  let requestAPI: TestAgent;
  let requestCredential: LoginRequest;

  beforeAll(() => {
    requestAPI = request(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();

    requestCredential = {
      username: faker.word.sample({
        length: {
          min: 3,
          max: 15
        }
      }),
      password: faker.internet.password()
    };
  });

  it("should return a 200 status code and access token when given valid credentials", async () => {
    await seedUser({
      username: requestCredential.username,
      password: requestCredential.password
    });

    const response = await requestAPI.post("/api/v1/auth/login").send({
      username: requestCredential.username,
      password: requestCredential.password
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.role).toBeDefined();
  });

  it("should return a 401 status code and message when provided with wrong password", async () => {
    await seedUser({
      username: requestCredential.username,
      password: requestCredential.password
    });

    const response = await requestAPI.post("/api/v1/auth/login").send({
      username: requestCredential.username,
      password: faker.internet.password()
    });

    expect(response.status).toBe(401);
    expect(response.body.accessToken).not.toBeDefined();
    expect(response.body.role).not.toBeDefined();
    expect(response.body.message).toBe("The username or password provided is incorrect.");
  });

  it("should return a 401 status code and message when provided with non-existing credentials", async () => {
    const response = await requestAPI.post("/api/v1/auth/login").send({
      username: requestCredential.username,
      password: faker.internet.password()
    });

    expect(response.status).toBe(401);
    expect(response.body.accessToken).not.toBeDefined();
    expect(response.body.role).not.toBeDefined();
    expect(response.body.message).toBe("The username or password provided is incorrect.");
  });
});
