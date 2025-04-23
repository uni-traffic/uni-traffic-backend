import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { DeleteViolationUseCase } from "../../src/useCases/deleteViolationUseCase";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { seedViolation } from "../utils/violation/seedViolation";
import { BadRequest, NotFoundError } from "../../../../shared/core/errors";

describe("DeleteViolationUseCase", () => {
  let deleteViolationUseCase: DeleteViolationUseCase;
  let repository: ViolationRepository;

  beforeAll(() => {
    deleteViolationUseCase = new DeleteViolationUseCase();
    repository = new ViolationRepository();
  });

  beforeEach(async () => {
    await db.violation.deleteMany();
  });

  it("should successfully soft delete a violation", async () => {
    const seededViolation = await seedViolation({});

    const result = await deleteViolationUseCase.execute(seededViolation.id);

    expect(result).toBeTruthy();
    expect(result.id).toBe(seededViolation.id);
    expect(result.isDeleted).toBe(true);

    const deletedRecord = await repository.getViolationById(seededViolation.id);
    expect(deletedRecord).toBeNull();

    const rawRecord = await db.violation.findUnique({
      where: { id: seededViolation.id }
    });
    expect(rawRecord?.isDeleted).toBe(true);
  });

  it("should throw NotFoundError when violation does not exist", async () => {
    const nonExistentId = faker.string.uuid();

    await expect(deleteViolationUseCase.execute(nonExistentId)).rejects.toThrow(
      new NotFoundError("Violation not found")
    );
  });

  it("should throw BadRequest when violation ID is empty", async () => {
    await expect(deleteViolationUseCase.execute("")).rejects.toThrow(
      new BadRequest("Violation ID is required")
    );
  });

  it("should maintain all other violation data after deletion", async () => {
    const seededViolation = await seedViolation({});
    const originalData = { ...seededViolation };

    await deleteViolationUseCase.execute(seededViolation.id);

    const rawRecord = await db.violation.findUnique({
      where: { id: seededViolation.id }
    });

    expect(rawRecord).toBeTruthy();
    expect(rawRecord?.category).toBe(originalData.category);
    expect(rawRecord?.violationName).toBe(originalData.violationName);
    expect(rawRecord?.penalty).toBe(originalData.penalty);
    expect(rawRecord?.isDeleted).toBe(true);
  });
});
