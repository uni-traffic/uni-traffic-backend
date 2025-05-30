import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { GetViolationUseCase } from "../../src/useCases/getViolationUseCase";
import { seedViolation } from "../utils/violation/seedViolation";

describe("GetViolationsUseCase", () => {
  let getViolationsUseCase: GetViolationUseCase;

  beforeAll(() => {
    getViolationsUseCase = new GetViolationUseCase();
  });

  beforeEach(async () => {
    await db.violation.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return violation with the matched id", async () => {
    const [seededViolation1] = await Promise.all([seedViolation({}), seedViolation({})]);

    const result = await getViolationsUseCase.execute({
      id: seededViolation1.id,
      count: "5",
      page: "1"
    });

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

    const result = await getViolationsUseCase.execute({
      category: category,
      count: "5",
      page: "1"
    });

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

    const result = await getViolationsUseCase.execute({
      searchKey: "parking",
      count: "5",
      page: "1"
    });

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

    const result = await getViolationsUseCase.execute({
      searchKey: seededViolation1.id.substring(0, Math.ceil(seededViolation1.id.length / 2)),
      count: "5",
      page: "1"
    });

    expect(result.violation.length).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.violation).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: seededViolation1.id })])
    );
  });
});
