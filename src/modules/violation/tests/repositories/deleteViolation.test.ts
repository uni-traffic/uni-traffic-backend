import { ViolationRepository } from "../../src/repositories/violationRepository";
import { seedViolation } from "../utils/violation/seedViolation";

describe("ViolationRepository.deleteViolation", () => {
  let repository: ViolationRepository;

  beforeAll(() => {
    repository = new ViolationRepository();
  });

  it("should soft delete a violation by setting isDeleted to true", async () => {
    const violation = await seedViolation({ isDeleted: false });

    const deletedViolation = await repository.deleteViolation(violation.id);
    expect(deletedViolation).not.toBeNull();
    expect(deletedViolation?.isDeleted).toBe(true);

    const fetched = await repository.getViolationById(violation.id);
    expect(fetched).toBeNull();
  });

  it("should return null if the violation does not exist", async () => {
    const result = await repository.deleteViolation("non-existent-id");
    expect(result).toBeNull();
  });
});
