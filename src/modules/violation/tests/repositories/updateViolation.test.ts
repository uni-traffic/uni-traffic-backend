import { db } from "../../../../shared/infrastructure/database/prisma";
import { ViolationRepository } from "../../src/repositories/violationRepository";
import { createViolationDomainObject } from "../utils/violation/createViolationDomainObject";
import { seedViolation } from "../utils/violation/seedViolation";

describe("ViolationRepository.updateViolation", () => {
  let repository: ViolationRepository;

  beforeAll(() => {
    repository = new ViolationRepository();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should update a violation in the database", async () => {
    const violation = await seedViolation({});
    const domainViolation = createViolationDomainObject({ id: violation.id });
    const updatedViolation = await repository.updateViolation(domainViolation);

    expect(updatedViolation).not.toBeNull();
    expect(updatedViolation?.id).toBe(domainViolation.id);
    expect(updatedViolation?.category).toBe(domainViolation.category);
    expect(updatedViolation?.violationName).toBe(domainViolation.violationName);
    expect(updatedViolation?.penalty).toBe(domainViolation.penalty);
  });

  it("should return null if the violation does not exist", async () => {
    const violation = createViolationDomainObject({ id: "non-existing-id" });
    const updatedViolation = await repository.updateViolation(violation);

    expect(updatedViolation).toBeNull();
  });
});
