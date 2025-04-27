import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { seedViolation } from "../utils/violation/seedViolation";

describe("ViolationRepository.getViolation", () => {
  let repository: ViolationRepository;

  beforeAll(() => {
    repository = new ViolationRepository();
  });

  beforeEach(async () => {
    await db.violation.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return violation with the matched id", async () => {
    const [seededViolation1] = await Promise.all([seedViolation({}), seedViolation({})]);

    const result = await repository.getViolation({
      id: seededViolation1.id,
      count: 5,
      page: 1
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededViolation1.id);
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

    const result = await repository.getViolation({
      category: category,
      count: 5,
      page: 1
    });

    expect(result.length).toBe(2);
    expect(result).toEqual(
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

    const result = await repository.getViolation({
      searchKey: "parking",
      count: 5,
      page: 1
    });

    expect(result.length).toBe(2);
    expect(result).toEqual(
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

    const result = await repository.getViolation({
      searchKey: seededViolation1.id.substring(0, Math.ceil(seededViolation1.id.length / 2)),
      count: 5,
      page: 1
    });

    expect(result.length).toBe(1);
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: seededViolation1.id })])
    );
  });
});
