import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import type { IViolationDTO } from "../../../../../src/dtos/violationDTO";
import { seedViolation } from "../../../../utils/violation/seedViolation";

describe("GET /api/v1/violation/search", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
    await db.violation.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return violation with the matched id", async () => {
    const [seededViolation1] = await Promise.all([seedViolation({}), seedViolation({})]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });

    const response = await requestAPI
      .get("/api/v1/violation/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: seededViolation1.id,
        count: "5",
        page: "1"
      });
    const result = response.body;

    expect(response.status).toBe(200);
    expect(result.violation.length).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.violation[0].id).toBe(seededViolation1.id);
  });

  it("should return violation that match the category", async () => {
    const category = faker.string.alpha({ casing: "upper" });
    await Promise.all([
      seedViolation({
        category: category
      }),
      seedViolation({
        category: category
      }),
      seedViolation({})
    ]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });

    const response = await requestAPI
      .get("/api/v1/violation/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        category: category,
        count: "5",
        page: "1"
      });
    const result = response.body;

    expect(response.status).toBe(200);
    expect(result.violation.length).toBe(2);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.violation).toEqual(
      expect.arrayContaining([expect.objectContaining({ category: category })])
    );
  });

  it("should return violation that properties match the given search key", async () => {
    const [seededViolation1, seededViolation2] = await Promise.all([
      seedViolation({
        violationName: "Parking in a No Parking Zone"
      }),
      seedViolation({
        violationName: "Parking in a Handicap Space Without a Permit"
      }),
      seedViolation({})
    ]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });

    const response = await requestAPI
      .get("/api/v1/violation/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        searchKey: "parking",
        count: "5",
        page: "1"
      });
    const result = response.body;

    expect(response.status).toBe(200);
    expect(result.violation.length).toBe(2);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.violation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: seededViolation1.id }),
        expect.objectContaining({ id: seededViolation2.id })
      ])
    );
  });

  it("should return violation that properties match the given search key", async () => {
    const [seededViolation1] = await Promise.all([
      seedViolation({
        violationName: "Parking in a No Parking Zone"
      }),
      seedViolation({
        violationName: "Parking in a Handicap Space Without a Permit"
      }),
      seedViolation({})
    ]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });

    const response = await requestAPI
      .get("/api/v1/violation/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        searchKey: seededViolation1.id.substring(0, Math.ceil(seededViolation1.id.length / 2)),
        count: "5",
        page: "1"
      });
    const result = response.body;

    expect(response.status).toBe(200);
    expect(result.violation.length).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.violation).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: seededViolation1.id })])
    );
  });

  it("should return violation with proper pagination", async () => {
    const [seededViolation1] = await Promise.all([
      seedViolation({ category: "A" }),
      seedViolation({ category: "A" }),
      seedViolation({ category: "A" }),
      seedViolation({ category: "B" }),
      seedViolation({ category: "B" }),
      seedViolation({ category: "B" })
    ]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });

    const response = await requestAPI
      .get("/api/v1/violation/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        count: "3",
        page: "1"
      });
    const result = response.body;

    expect(response.status).toBe(200);
    expect(result.violation.length).toBe(3);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(2);
    expect(result.violation).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: seededViolation1.id })])
    );
  });

  it("should return violation with proper pagination", async () => {
    const [seededViolation1] = await Promise.all([
      seedViolation({ category: "A" }),
      seedViolation({ category: "A" }),
      seedViolation({ category: "A" }),
      seedViolation({ category: "B" }),
      seedViolation({ category: "B" }),
      seedViolation({ category: "B" })
    ]);
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });

    const response = await requestAPI
      .get("/api/v1/violation/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        count: "3",
        page: "2"
      });
    const result = response.body;

    expect(response.status).toBe(200);
    expect(result.violation.length).toBe(3);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.totalPages).toBe(2);
    expect((result.violation as IViolationDTO[]).map((violation) => violation.id)).not.toContain(
      seededViolation1.id
    );
  });
});
