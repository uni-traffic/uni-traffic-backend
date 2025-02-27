import { db } from "../../../../shared/infrastructure/database/prisma";
import { ViolationRepository } from "../../src/repositories/violationRepository";

describe("ViolationRepository.getAllViolations", () => {
  let violationRepository: ViolationRepository;

  beforeAll(() => {
    violationRepository = new ViolationRepository();
  });

  it("should return all violations from the database", async () => {
    const seededViolations = await db.violation.findMany();

    const violations = await violationRepository.getAllViolations();

    expect(violations).toEqual(
      seededViolations.map((v) => ({
        id: v.id,
        category: v.category,
        violationName: v.violationName,
        penalty: v.penalty
      }))
    );
  });

  it("should return an empty array if no violations exist", async () => {
    await db.violation.deleteMany();

    const violations = await violationRepository.getAllViolations();

    expect(violations).toEqual([]);
  });
});
