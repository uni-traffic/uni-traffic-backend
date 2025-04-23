import { faker } from "@faker-js/faker";
import { ForbiddenError, NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { DeleteViolationUseCase } from "../../src/useCases/deleteViolationUseCase";
import { seedViolation } from "../utils/violation/seedViolation";

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

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully soft delete a violation", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });
    const seededViolation = await seedViolation({
      isDeleted: false
    });

    const result = await deleteViolationUseCase.execute({
      violationId: seededViolation.id,
      actorId: seededActor.id
    });

    expect(result).toBeTruthy();
    expect(result.id).toBe(seededViolation.id);
    expect(result.isDeleted).toBe(true);

    const deletedRecord = await repository.getViolationById(seededViolation.id);
    expect(deletedRecord).not.toBeNull();
    expect(deletedRecord?.isDeleted).toBe(true);

    const rawRecord = await db.violation.findUnique({
      where: { id: seededViolation.id }
    });
    expect(rawRecord?.isDeleted).toBe(true);
  });

  it("should throw NotFoundError when violation does not exist", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });
    const nonExistentId = faker.string.uuid();

    await expect(
      deleteViolationUseCase.execute({
        violationId: nonExistentId,
        actorId: seededActor.id
      })
    ).rejects.toThrow(new NotFoundError("Violation not found"));
  });

  it("should maintain all other violation data after deletion", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN"])
    });
    const seededViolation = await seedViolation({});
    const originalData = { ...seededViolation };

    await deleteViolationUseCase.execute({
      violationId: seededViolation.id,
      actorId: seededActor.id
    });

    const rawRecord = await db.violation.findUnique({
      where: { id: seededViolation.id }
    });

    expect(rawRecord).toBeTruthy();
    expect(rawRecord?.category).toBe(originalData.category);
    expect(rawRecord?.violationName).toBe(originalData.violationName);
    expect(rawRecord?.penalty).toBe(originalData.penalty);
    expect(rawRecord?.isDeleted).toBe(true);
  });

  it("should not throw ForbiddenError when user doesn't have permission to delete violation", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF", "CASHIER"])
    });

    await expect(
      deleteViolationUseCase.execute({
        actorId: seededActor.id,
        violationId: faker.string.uuid()
      })
    ).rejects.toThrow(new ForbiddenError("You do not have permission to perform this action."));
  });
});
