import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { CreateViolationUseCase } from "../../src/useCases/createViolationUseCase";

describe("CreateViolationUseCase", () => {
  let createViolationUseCase: CreateViolationUseCase;

  beforeAll(() => {
    createViolationUseCase = new CreateViolationUseCase();
  });

  beforeEach(async () => {
    await db.violation.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully create a violation", async () => {
    const mockViolationData = {
      category: faker.helpers.arrayElement(["A", "B", "C"]),
      violationName: faker.lorem.words(2),
      penalty: 100
    };

    const result = await createViolationUseCase.execute(mockViolationData);

    expect(result).toBeTruthy();
    expect(result.category).toBe(mockViolationData.category);
    expect(result.violationName).toBe(mockViolationData.violationName);
    expect(result.penalty).toBe(mockViolationData.penalty);
  });

  it("should throw BadRequestError when penalty is negative", async () => {
    await expect(
      createViolationUseCase.execute({
        category: "TEST",
        violationName: "Test Violation",
        penalty: -50
      })
    ).rejects.toThrow("Penalty cannot be negative");
  });

  it("should throw BadRequestError when violation name is empty", async () => {
    await expect(
      createViolationUseCase.execute({
        category: "TEST",
        violationName: "",
        penalty: 100
      })
    ).rejects.toThrow("Violation name cannot be empty");
  });

  it("should throw BadRequestError when category is empty", async () => {
    await expect(
      createViolationUseCase.execute({
        category: "",
        violationName: "Test Violation",
        penalty: 100
      })
    ).rejects.toThrow("Category cannot be empty");
  });
});
